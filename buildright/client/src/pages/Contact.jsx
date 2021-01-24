import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Card from '../components/Card';
import Button from '../components/Button';
import { Input, Textarea, Select } from '../components/Input';
import SectionHeading from '../components/SectionHeading';
import { submitQuote } from '../api/endpoints';
import { getErrorMessage } from '../api/axios';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      projectType: '',
      budget: '',
      squareMeters: '',
      message: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      // Clean up empties — the server marks these optional.
      const payload = {
        ...values,
        budget: values.budget === '' ? undefined : Number(values.budget),
        squareMeters: values.squareMeters === '' ? undefined : Number(values.squareMeters),
      };
      const response = await submitQuote(payload);
      toast.success(response.message || 'Thanks — we’ll be in touch shortly.');
      reset();
      setSubmitted(true);
    } catch (err) {
      const message = getErrorMessage(err, 'We couldn’t send that — please try again.');
      toast.error(message);
      // Surface server-side validation messages if present.
      const serverErrors = err?.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length) {
        serverErrors.forEach((m) => toast.error(m));
      }
    }
  };

  if (submitted) {
    return (
      <section className="container-px py-20">
        <Card className="mx-auto max-w-xl p-8 text-center">
          <div className="text-5xl" aria-hidden="true">✅</div>
          <h1 className="mt-4 text-2xl font-bold">Request received</h1>
          <p className="mt-2 text-slate-600">
            Thanks — your brief has landed. A director will be in touch within two business days.
          </p>
          <Button className="mt-6" onClick={() => setSubmitted(false)}>
            Send another request
          </Button>
        </Card>
      </section>
    );
  }

  return (
    <>
      <section className="bg-slate-50 bg-blueprint bg-grid">
        <div className="container-px py-16 md:py-20">
          <SectionHeading
            eyebrow="Get a quote"
            title="Tell us about the project"
            subtitle="A few details now save a couple of calls later. We’ll come back within two business days."
          />
        </div>
      </section>

      <section className="container-px py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="name"
                  label="Your name"
                  required
                  placeholder="Eoin Brennan"
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register('name', { required: 'Please tell us your name' })}
                />
                <Input
                  id="email"
                  label="Email"
                  type="email"
                  required
                  placeholder="you@company.ie"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'That email doesn’t look right' },
                  })}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="phone"
                  label="Phone"
                  placeholder="+353 …"
                  autoComplete="tel"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <Select
                  id="projectType"
                  label="Project type"
                  required
                  defaultValue=""
                  error={errors.projectType?.message}
                  {...register('projectType', { required: 'Please choose a project type' })}
                >
                  <option value="" disabled>Choose one…</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="renovation">Renovation</option>
                  <option value="industrial">Industrial</option>
                  <option value="other">Something else</option>
                </Select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  id="budget"
                  label="Indicative budget (€)"
                  type="number"
                  min="0"
                  placeholder="500000"
                  error={errors.budget?.message}
                  {...register('budget', {
                    min: { value: 0, message: 'Budget must be a positive number' },
                  })}
                />
                <Input
                  id="squareMeters"
                  label="Floor area (m²)"
                  type="number"
                  min="0"
                  placeholder="150"
                  error={errors.squareMeters?.message}
                  {...register('squareMeters', {
                    min: { value: 0, message: 'Area must be a positive number' },
                  })}
                />
              </div>

              <Textarea
                id="message"
                label="A short brief"
                rows={5}
                placeholder="A two-storey side extension and full ground-floor refurb. Planning lodged in March 2022…"
                error={errors.message?.message}
                {...register('message', {
                  maxLength: { value: 2000, message: 'Brief is a bit too long — please trim it down' },
                })}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-xs text-slate-500">We’ll never share your details with anyone else.</p>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send request'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Sidebar */}
          <aside className="space-y-5">
            <Card className="p-6">
              <h3 className="text-lg font-semibold">Office</h3>
              <p className="mt-2 text-sm text-slate-600">
                Unit 12, Docklands Innovation Park
                <br />
                East Wall Road, Dublin 3
              </p>
              <p className="mt-3 text-sm">
                <a href="tel:+35315551234" className="text-brand-700 hover:underline">+353 1 555 1234</a>
                <br />
                <a href="mailto:hello@buildright.dev" className="text-brand-700 hover:underline">hello@buildright.dev</a>
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold">What happens next</h3>
              <ol className="mt-3 space-y-2 text-sm text-slate-600">
                <li>1. A director reads your brief.</li>
                <li>2. We come back within two business days with questions or a meeting time.</li>
                <li>3. After a site visit, you get an indicative cost range and outline programme.</li>
              </ol>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Contact;
