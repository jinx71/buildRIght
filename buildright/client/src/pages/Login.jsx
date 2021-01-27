import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import Button from '../components/Button';
import { Input } from '../components/Input';
import Logo from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const redirectTo = location.state?.from || '/admin';

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await login(values);
      toast.success('Signed in');
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Sign-in failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-px flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-md p-8">
        <div className="flex justify-center"><Logo /></div>
        <h1 className="mt-6 text-center text-2xl font-bold">Admin sign-in</h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Internal use only. Manage quote requests and the project portfolio.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
          <Input
            id="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@buildright.dev"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'That email doesn’t look right' },
            })}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Default seeded credentials: <code className="rounded bg-slate-100 px-1 py-0.5">admin@buildright.dev</code>{' '}
          / <code className="rounded bg-slate-100 px-1 py-0.5">admin12345</code>
        </p>
        <p className="mt-4 text-center text-sm">
          <Link to="/" className="text-slate-500 hover:text-brand-700">← Back to site</Link>
        </p>
      </Card>
    </section>
  );
};

export default Login;
