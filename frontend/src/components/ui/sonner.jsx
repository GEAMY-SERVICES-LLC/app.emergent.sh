import { Toaster as Sonner, toast } from "sonner"

const Toaster = ({
  ...props
}) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-[#0a1120] text-white border border-white/10 shadow-lg font-mono",
          description: "text-gray-400",
          actionButton:
            "bg-[#00d4ff] text-[#040810]",
          cancelButton:
            "bg-white/10 text-gray-400",
          success: "border-[#00ff88]/30",
          error: "border-red-500/30",
        },
      }}
      {...props} />
  );
}

export { Toaster, toast }
