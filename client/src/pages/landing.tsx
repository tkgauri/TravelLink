import { Button } from "@/components/ui/button";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center">
        <img 
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
          alt="Group of travelers" 
          className="w-64 h-48 rounded-3xl object-cover mb-8 shadow-lg"
        />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Find Your Perfect<br />Travel Buddy
        </h1>
        <p className="text-gray-600 mb-8 max-w-sm">
          Connect with like-minded travelers, share amazing experiences, and create unforgettable memories together.
        </p>
        
        <div className="w-full max-w-sm space-y-4">
          <Button 
            onClick={handleLogin}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg h-14"
            data-testid="button-login"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
