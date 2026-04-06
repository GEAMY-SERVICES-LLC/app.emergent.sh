from fastapi import FastAPI, APIRouter, HTTPException, Depends, BackgroundTasks, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from pydantic_settings import BaseSettings
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

# Microsoft Graph imports (optional - will be enabled when credentials are provided)
try:
    from azure.identity.aio import ClientSecretCredential
    from msgraph import GraphServiceClient
    from msgraph.generated.models.message import Message
    from msgraph.generated.models.item_body import ItemBody
    from msgraph.generated.models.body_type import BodyType
    from msgraph.generated.models.recipient import Recipient
    from msgraph.generated.models.email_address import EmailAddress
    from msgraph.generated.users.item.send_mail.send_mail_post_request_body import SendMailPostRequestBody
    GRAPH_AVAILABLE = True
except ImportError:
    GRAPH_AVAILABLE = False

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Settings
class Settings(BaseSettings):
    azure_client_id: str = ""
    azure_client_secret: str = ""
    azure_tenant_id: str = ""
    sender_email: str = "bot@geamyservices.com"
    recipient_email: str = "gerardo@geamyservices.com"
    jwt_secret: str = "geamy-services-secret-key-2024"
    jwt_algorithm: str = "HS256"
    admin_email: str = "admin@geamyservices.com"
    admin_password: str = "GeamyAdmin2024!"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Create the main app
app = FastAPI(title="Geamy Services API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer(auto_error=False)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class ContactSubmission(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str = ""
    service: str
    message: str
    status: str = "new"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_sent: bool = False

class ContactSubmissionCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    service: str
    message: str

class AdminLogin(BaseModel):
    email: str
    password: str

class AdminUser(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AnalyticsEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    event_type: str
    page: str = ""
    metadata: dict = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AnalyticsEventCreate(BaseModel):
    event_type: str
    page: str = ""
    metadata: dict = {}

# ==================== EMAIL SERVICE ====================

async def get_graph_client():
    """Initialize and return an authenticated GraphServiceClient."""
    if not GRAPH_AVAILABLE:
        return None
    
    if not all([settings.azure_client_id, settings.azure_client_secret, settings.azure_tenant_id]):
        return None
    
    try:
        credential = ClientSecretCredential(
            tenant_id=settings.azure_tenant_id,
            client_id=settings.azure_client_id,
            client_secret=settings.azure_client_secret
        )
        return GraphServiceClient(credentials=credential)
    except Exception as e:
        logger.error(f"Failed to initialize GraphServiceClient: {e}")
        return None

async def send_contact_email(submission: ContactSubmission):
    """Send email notification for contact form submission."""
    graph_client = await get_graph_client()
    
    if not graph_client:
        logger.warning("Microsoft Graph not configured - email not sent")
        return False
    
    try:
        html_body = f"""
        <html>
        <head>
            <style>
                body {{ font-family: 'DM Mono', monospace; color: #333; background: #f5f5f5; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; background: white; }}
                .header {{ background: #040810; color: #00d4ff; padding: 20px; text-align: center; }}
                .field {{ margin: 15px 0; padding: 10px; background: #f9f9f9; }}
                .label {{ font-weight: bold; color: #040810; }}
                .footer {{ margin-top: 30px; padding: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>New Contact Form Submission</h2>
                    <p>Geamy Services LLC</p>
                </div>
                <div class="field">
                    <span class="label">Name:</span> {submission.name}
                </div>
                <div class="field">
                    <span class="label">Email:</span> {submission.email}
                </div>
                <div class="field">
                    <span class="label">Phone:</span> {submission.phone or 'Not provided'}
                </div>
                <div class="field">
                    <span class="label">Service Needed:</span> {submission.service}
                </div>
                <div class="field">
                    <span class="label">Message:</span>
                    <p>{submission.message}</p>
                </div>
                <div class="footer">
                    <p>This email was sent automatically from geamyservices.com</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        message = Message()
        message.subject = f"New Contact: {submission.service} - {submission.name}"
        message.body = ItemBody()
        message.body.content_type = BodyType.Html
        message.body.content = html_body
        
        to_recipient = Recipient()
        to_recipient.email_address = EmailAddress()
        to_recipient.email_address.address = settings.recipient_email
        message.to_recipients = [to_recipient]
        
        request_body = SendMailPostRequestBody()
        request_body.message = message
        request_body.save_to_sent_items = True
        
        await graph_client.users.by_user_id(settings.sender_email).send_mail.post(request_body)
        logger.info(f"Email sent successfully for submission {submission.id}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return False

# ==================== AUTH HELPERS ====================

def create_token(email: str) -> str:
    """Create JWT token for admin user."""
    payload = {
        "sub": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "iat": datetime.now(timezone.utc)
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)

def verify_token(token: str) -> Optional[str]:
    """Verify JWT token and return email."""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return payload.get("sub")
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current admin user from token."""
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    email = verify_token(credentials.credentials)
    if not email:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    admin = await db.admins.find_one({"email": email}, {"_id": 0})
    if not admin:
        raise HTTPException(status_code=401, detail="Admin not found")
    
    return admin

# ==================== STARTUP ====================

@app.on_event("startup")
async def startup_event():
    """Initialize database and create default admin."""
    # Create indexes
    await db.contacts.create_index("email")
    await db.contacts.create_index("created_at")
    await db.analytics.create_index("event_type")
    await db.analytics.create_index("created_at")
    
    # Create default admin if not exists
    existing_admin = await db.admins.find_one({"email": settings.admin_email})
    if not existing_admin:
        password_hash = bcrypt.hashpw(settings.admin_password.encode(), bcrypt.gensalt()).decode()
        admin = AdminUser(email=settings.admin_email, password_hash=password_hash)
        doc = admin.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.admins.insert_one(doc)
        logger.info(f"Created default admin: {settings.admin_email}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# ==================== PUBLIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Geamy Services API", "status": "online"}

@api_router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "Geamy Services API",
        "graph_available": GRAPH_AVAILABLE and bool(settings.azure_client_id)
    }

@api_router.post("/contact", response_model=dict, status_code=status.HTTP_202_ACCEPTED)
async def submit_contact(data: ContactSubmissionCreate, background_tasks: BackgroundTasks):
    """Submit contact form."""
    submission = ContactSubmission(**data.model_dump())
    
    doc = submission.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contacts.insert_one(doc)
    
    # Send email in background
    background_tasks.add_task(send_email_and_update, submission.id)
    
    return {
        "message": "Thank you for contacting us. We'll get back to you soon.",
        "id": submission.id,
        "status": "received"
    }

async def send_email_and_update(submission_id: str):
    """Send email and update submission status."""
    submission_doc = await db.contacts.find_one({"id": submission_id}, {"_id": 0})
    if submission_doc:
        if isinstance(submission_doc['created_at'], str):
            submission_doc['created_at'] = datetime.fromisoformat(submission_doc['created_at'])
        submission = ContactSubmission(**submission_doc)
        email_sent = await send_contact_email(submission)
        await db.contacts.update_one(
            {"id": submission_id},
            {"$set": {"email_sent": email_sent}}
        )

@api_router.post("/analytics")
async def track_analytics(data: AnalyticsEventCreate):
    """Track analytics event."""
    event = AnalyticsEvent(**data.model_dump())
    
    doc = event.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.analytics.insert_one(doc)
    
    return {"status": "tracked", "id": event.id}

# ==================== ADMIN AUTH ROUTES ====================

@api_router.post("/admin/login")
async def admin_login(data: AdminLogin):
    """Admin login."""
    admin = await db.admins.find_one({"email": data.email}, {"_id": 0})
    
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(data.password.encode(), admin['password_hash'].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(data.email)
    
    return {
        "token": token,
        "email": data.email,
        "message": "Login successful"
    }

@api_router.get("/admin/me")
async def get_admin_profile(admin: dict = Depends(get_current_admin)):
    """Get current admin profile."""
    return {
        "email": admin['email'],
        "id": admin['id']
    }

# ==================== ADMIN PROTECTED ROUTES ====================

@api_router.get("/admin/contacts", response_model=List[dict])
async def get_contacts(
    status_filter: Optional[str] = None,
    limit: int = 50,
    admin: dict = Depends(get_current_admin)
):
    """Get all contact submissions."""
    query = {}
    if status_filter:
        query["status"] = status_filter
    
    contacts = await db.contacts.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    
    for contact in contacts:
        if isinstance(contact['created_at'], str):
            contact['created_at'] = datetime.fromisoformat(contact['created_at']).isoformat()
    
    return contacts

@api_router.get("/admin/contacts/{contact_id}")
async def get_contact(contact_id: str, admin: dict = Depends(get_current_admin)):
    """Get single contact submission."""
    contact = await db.contacts.find_one({"id": contact_id}, {"_id": 0})
    
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    return contact

@api_router.patch("/admin/contacts/{contact_id}")
async def update_contact_status(
    contact_id: str,
    status_update: dict,
    admin: dict = Depends(get_current_admin)
):
    """Update contact submission status."""
    result = await db.contacts.update_one(
        {"id": contact_id},
        {"$set": {"status": status_update.get("status", "new")}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    return {"message": "Status updated", "id": contact_id}

@api_router.delete("/admin/contacts/{contact_id}")
async def delete_contact(contact_id: str, admin: dict = Depends(get_current_admin)):
    """Delete contact submission."""
    result = await db.contacts.delete_one({"id": contact_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    return {"message": "Contact deleted", "id": contact_id}

@api_router.get("/admin/analytics/summary")
async def get_analytics_summary(admin: dict = Depends(get_current_admin)):
    """Get analytics summary."""
    # Total contacts
    total_contacts = await db.contacts.count_documents({})
    
    # Contacts by status
    pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    status_counts = await db.contacts.aggregate(pipeline).to_list(100)
    
    # Contacts by service
    service_pipeline = [
        {"$group": {"_id": "$service", "count": {"$sum": 1}}}
    ]
    service_counts = await db.contacts.aggregate(service_pipeline).to_list(100)
    
    # Recent contacts (last 7 days)
    seven_days_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    recent_contacts = await db.contacts.count_documents({
        "created_at": {"$gte": seven_days_ago}
    })
    
    # Page views
    page_views = await db.analytics.count_documents({"event_type": "page_view"})
    
    return {
        "total_contacts": total_contacts,
        "recent_contacts": recent_contacts,
        "contacts_by_status": {item['_id']: item['count'] for item in status_counts},
        "contacts_by_service": {item['_id']: item['count'] for item in service_counts},
        "page_views": page_views
    }

@api_router.get("/admin/analytics/events")
async def get_analytics_events(
    event_type: Optional[str] = None,
    limit: int = 100,
    admin: dict = Depends(get_current_admin)
):
    """Get analytics events."""
    query = {}
    if event_type:
        query["event_type"] = event_type
    
    events = await db.analytics.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    
    return events

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
