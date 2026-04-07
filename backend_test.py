import requests
import sys
import json
import os
from datetime import datetime

class GeamyServicesAPITester:
    def __init__(self, base_url="https://secure-tech-services.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token and 'Authorization' not in test_headers:
            test_headers['Authorization'] = f'Bearer {self.token}'

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text[:200]}"
                self.log_test(name, False, error_msg)
                return False, {}

        except Exception as e:
            error_msg = f"Request failed: {str(e)}"
            self.log_test(name, False, error_msg)
            return False, {}

    def test_health_check(self):
        """Test health check endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_contact_submission(self):
        """Test contact form submission"""
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "555-123-4567",
            "service": "Network Infrastructure",
            "message": "This is a test message for API testing."
        }
        
        success, response = self.run_test(
            "Contact Form Submission", 
            "POST", 
            "contact", 
            202,  # Expecting 202 ACCEPTED
            data=contact_data
        )
        
        if success and 'id' in response:
            self.contact_id = response['id']
            print(f"   Contact ID: {self.contact_id}")
        
        return success, response

    def test_admin_login(self):
        """Test admin login"""
        login_data = {
            "email": "admin@geamyservices.com",
            "password": os.environ.get("TEST_ADMIN_PASSWORD", "")
        }
        
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "admin/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            print(f"   Token received: {self.token[:20]}...")
            return True, response
        
        return False, response

    def test_admin_profile(self):
        """Test getting admin profile"""
        if not self.token:
            self.log_test("Admin Profile", False, "No token available")
            return False, {}
        
        return self.run_test("Admin Profile", "GET", "admin/me", 200)

    def test_get_contacts(self):
        """Test getting contacts list"""
        if not self.token:
            self.log_test("Get Contacts", False, "No token available")
            return False, {}
        
        return self.run_test("Get Contacts", "GET", "admin/contacts", 200)

    def test_analytics_summary(self):
        """Test analytics summary"""
        if not self.token:
            self.log_test("Analytics Summary", False, "No token available")
            return False, {}
        
        return self.run_test("Analytics Summary", "GET", "admin/analytics/summary", 200)

    def test_analytics_tracking(self):
        """Test analytics event tracking"""
        analytics_data = {
            "event_type": "page_view",
            "page": "test",
            "metadata": {
                "test": True,
                "timestamp": datetime.now().isoformat()
            }
        }
        
        return self.run_test(
            "Analytics Tracking",
            "POST",
            "analytics",
            200,
            data=analytics_data
        )

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Geamy Services API Tests")
        print(f"Base URL: {self.base_url}")
        print("=" * 50)

        # Public endpoints
        self.test_root_endpoint()
        self.test_health_check()
        self.test_analytics_tracking()
        self.test_contact_submission()
        
        # Admin authentication
        login_success, _ = self.test_admin_login()
        
        if login_success:
            # Protected endpoints
            self.test_admin_profile()
            self.test_get_contacts()
            self.test_analytics_summary()
        else:
            print("\n⚠️  Skipping protected endpoint tests due to login failure")

        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed")
            print("\nFailed tests:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['details']}")
            return 1

def main():
    tester = GeamyServicesAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())