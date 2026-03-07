import { Button } from "@/components/ui/button";
import { Brain, Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPrompt() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background mesh-bg px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="glass-card rounded-3xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-3">
            Welcome to MindBridge
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Your safe space for mental wellness. Please sign in to access your
            personalized assessment tools, resources, and support network.
          </p>

          <div className="flex items-center gap-2 bg-muted/60 rounded-xl p-3 mb-6 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary flex-shrink-0" />
            <span>
              Your data is private and secure. Only you control who sees your
              results.
            </span>
          </div>

          <Button
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base shadow-teal"
            data-ocid="login.primary_button"
          >
            {isLoggingIn || isInitializing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {isInitializing ? "Initializing..." : "Signing in..."}
              </>
            ) : (
              "Sign In Securely"
            )}
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Uses Internet Identity — your anonymous, password-free login
          </p>
        </div>
      </motion.div>
    </div>
  );
}
