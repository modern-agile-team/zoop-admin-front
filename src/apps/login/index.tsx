import LoginForm from './components/LoginFrom';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
}
