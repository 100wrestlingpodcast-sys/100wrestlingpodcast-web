import React, { useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import { Mail, Send, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FormState {
  fullName: string;
  brandName: string;
  email: string;
  phone: string;
  proposalType: string;
  budget: string;
  message: string;
  consent: boolean;
  company_fax_only: string; // Honeypot spam trap
}

const INITIAL_FORM: FormState = {
  fullName: '',
  brandName: '',
  email: '',
  phone: '',
  proposalType: 'auspicio',
  budget: '',
  message: '',
  consent: false,
  company_fax_only: ''
};

export const ContactPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);

  const proposalOptions = [
    { id: 'auspicio', label: i18n.language === 'en' ? 'Podcast Sponsorship' : 'Auspicio del podcast' },
    { id: 'publicidad', label: i18n.language === 'en' ? 'Social Media Advertising' : 'Publicidad en redes sociales' },
    { id: 'integracion', label: i18n.language === 'en' ? 'Product Integration' : 'Integración de producto' },
    { id: 'colaboracion', label: i18n.language === 'en' ? 'Interview or Collaboration' : 'Entrevista o colaboración' },
    { id: 'cobertura', label: i18n.language === 'en' ? 'Event Coverage' : 'Cobertura de evento' },
    { id: 'otro', label: i18n.language === 'en' ? 'Other' : 'Otro' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const sanitizeInput = (text: string): string => {
    return text.replace(/<[^>]*>/g, '').trim();
  };

  const checkRateLimit = (): boolean => {
    const limitKey = '100wrestling_contact_limits';
    const limitData = localStorage.getItem(limitKey);
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;

    if (limitData) {
      try {
        const parsed = JSON.parse(limitData) as { count: number; lastTime: number };
        if (now - parsed.lastTime < hourMs) {
          if (parsed.count >= 3) {
            return false; // Limit exceeded
          }
          localStorage.setItem(limitKey, JSON.stringify({ count: parsed.count + 1, lastTime: parsed.lastTime }));
        } else {
          // Reset limit
          localStorage.setItem(limitKey, JSON.stringify({ count: 1, lastTime: now }));
        }
      } catch (e) {
        localStorage.setItem(limitKey, JSON.stringify({ count: 1, lastTime: now }));
      }
    } else {
      localStorage.setItem(limitKey, JSON.stringify({ count: 1, lastTime: now }));
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSubmitStatus('idle');

    // 1. Honeypot check
    if (formData.company_fax_only !== '') {
      console.warn("Spam detected via Honeypot trap.");
      // Silent mock success to avoid letting the bot know it failed
      setSubmitStatus('success');
      setFormData(INITIAL_FORM);
      return;
    }

    // Sanitized values
    const sanitizedName = sanitizeInput(formData.fullName);
    const sanitizedBrand = sanitizeInput(formData.brandName);
    const sanitizedMessage = sanitizeInput(formData.message);
    const sanitizedEmail = sanitizeInput(formData.email);
    
    // 2. Validate mandatory fields
    if (!sanitizedName || !sanitizedBrand || !sanitizedEmail || !sanitizedMessage) {
      setValidationError(t('contact.validation.nameRequired'));
      return;
    }

    // 3. Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError(t('contact.validation.emailInvalid'));
      return;
    }

    // 4. Consent check
    if (!formData.consent) {
      setValidationError(i18n.language === 'en' ? 'You must consent to data processing.' : 'Debes dar tu consentimiento para el procesamiento de datos.');
      return;
    }

    // 5. Rate limit check
    if (!checkRateLimit()) {
      setValidationError(t('contact.form.limitMessage'));
      return;
    }

    setIsSubmitting(true);

    // Simulated API call (prepared for Apps Script/Firebase Function)
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 95% success rate
          if (Math.random() > 0.05) {
            resolve(true);
          } else {
            reject(new Error("Timeout or Network Error"));
          }
        }, 1500);
      });

      setSubmitStatus('success');
      setFormData(INITIAL_FORM);
    } catch (err) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-12 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-left">
      
      {/* Page Header */}
      <section className="border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-display font-black uppercase text-gray-950 tracking-tight m-0">
          {t('contact.title')}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {t('contact.desc')}
        </p>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Brand Info and direct mailto */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-[#0A0A0A] p-6 rounded-xl border border-white/10 shadow-xl flex flex-col gap-6 relative overflow-hidden group text-white">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-red/20 transition-colors duration-500" />
            
            <h3 className="text-sm font-display font-black uppercase text-white tracking-wider m-0 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-brand-red rounded-full" />
              {i18n.language === 'en' ? 'Contact Info' : 'Información de Contacto'}
            </h3>
            
            <p className="text-xs text-white/70 leading-relaxed m-0">
              {t('contact.sidebar.desc')}
            </p>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center gap-4 hover:border-brand-red/30 transition-all duration-300">
              <div className="p-3 rounded-lg bg-brand-red/10 text-brand-red shrink-0 border border-brand-red/20 shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-white/50 uppercase tracking-widest block font-display font-bold">Email</span>
                <a 
                  href={`mailto:${siteConfig.contactEmail}`} 
                  className="hover:text-brand-red font-mono text-xs sm:text-sm font-semibold transition-colors block truncate text-white"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>

            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-brand-red to-[#b91c1c] text-white text-xs font-display font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {t('contact.sidebar.sendEmail')}
            </a>
          </div>

          <div className="p-5 rounded-xl bg-[#0A0A0A] border border-white/10 flex gap-3 items-start text-white shadow-md">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-white/60 leading-relaxed m-0">
              {i18n.language === 'en' 
                ? 'Security & Spam: Your information is processed securely and kept confidential. We never sell your data to third parties.'
                : 'Spam y seguridad: Tu información es procesada de forma segura y confidencial. No vendemos tus datos a terceros y solo los usaremos para evaluar la propuesta comercial.'}
            </p>
          </div>
        </section>

        {/* Right Side: Commercial Form */}
        <section className="lg:col-span-8">
          <div className="bg-[#0A0A0A] p-6 rounded-xl border border-white/10 shadow-xl text-white">
            <h3 className="text-sm font-display font-black uppercase text-white tracking-wider mb-6 m-0 border-b border-white/10 pb-3">
              {i18n.language === 'en' ? 'Business Proposal Form' : 'Formulario de Propuesta Comercial'}
            </h3>

            {submitStatus === 'success' ? (
              <div className="p-8 text-center flex flex-col items-center gap-4 bg-green-950/40 border border-green-500/30 rounded-xl my-4 text-white">
                <CheckCircle2 className="w-14 h-14 text-green-400" />
                <div>
                  <h4 className="text-base font-display font-bold uppercase text-white m-0">
                    {i18n.language === 'en' ? 'Proposal Sent!' : '¡Propuesta Enviada!'}
                  </h4>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed max-w-md">
                    {t('contact.validation.successMessage')}
                  </p>
                </div>
                <button
                  onClick={() => setSubmitStatus('idle')}
                  className="mt-2 px-5 py-2 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95 shadow-xs"
                >
                  {i18n.language === 'en' ? 'Write another proposal' : 'Volver a escribir'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                
                {/* Honeypot Spam Trap (Invisible for users, bots fall for it) */}
                <input 
                  type="text" 
                  name="company_fax_only" 
                  value={formData.company_fax_only}
                  onChange={handleInputChange}
                  className="hidden" 
                  tabIndex={-1} 
                  autoComplete="off" 
                  placeholder="Do not fill this field"
                />

                {/* Validation Error Banner */}
                {validationError && (
                  <div className="p-3.5 bg-brand-red/20 border border-brand-red/40 text-brand-red rounded text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Row 1: Name & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-fullName" className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                      {t('contact.form.fullName')} <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="contact-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder={i18n.language === 'en' ? "e.g. John Doe" : "Ej. Juan Pérez"}
                      className="px-4 py-2.5 bg-black/60 border border-white/20 focus:border-brand-red focus:bg-black/80 rounded text-xs text-white placeholder-white/40 outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-brandName" className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                      {t('contact.form.company')} <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="contact-brandName"
                      type="text"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleInputChange}
                      required
                      placeholder={i18n.language === 'en' ? "e.g. Ringside Inc." : "Ej. Ringside S.A."}
                      className="px-4 py-2.5 bg-black/60 border border-white/20 focus:border-brand-red focus:bg-black/80 rounded text-xs text-white placeholder-white/40 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                      {t('contact.form.email')} <span className="text-brand-red">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@company.com"
                      className="px-4 py-2.5 bg-black/60 border border-white/20 focus:border-brand-red focus:bg-black/80 rounded text-xs text-white placeholder-white/40 outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-phone" className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      id="contact-phone"
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 012-3456"
                      className="px-4 py-2.5 bg-black/60 border border-white/20 focus:border-brand-red focus:bg-black/80 rounded text-xs text-white placeholder-white/40 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: Proposal Type & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-proposalType" className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                      {t('contact.form.proposalType')} <span className="text-brand-red">*</span>
                    </label>
                    <select
                      id="contact-proposalType"
                      name="proposalType"
                      value={formData.proposalType}
                      onChange={handleInputChange}
                      className="px-4 py-2.5 bg-black/60 border border-white/20 focus:border-brand-red focus:bg-black/80 rounded text-xs text-white outline-none transition-colors cursor-pointer"
                    >
                      {proposalOptions.map(opt => (
                        <option key={opt.id} value={opt.id} className="bg-neutral-900 text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-budget" className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                      {t('contact.form.budget')}
                    </label>
                    <input
                      id="contact-budget"
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder={i18n.language === 'en' ? "e.g. Under $500 / $1000+" : "Ej. Menos de $500 / $1000+"}
                      className="px-4 py-2.5 bg-black/60 border border-white/20 focus:border-brand-red focus:bg-black/80 rounded text-xs text-white placeholder-white/40 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-message" className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                    {t('contact.form.message')} <span className="text-brand-red">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder={i18n.language === 'en' ? "Describe your business proposal, campaign timelines, ideas, etc. in detail." : "Describe en detalle tu propuesta comercial, ideas de integración, fechas de campaña, etc."}
                    className="px-4 py-2.5 bg-black/60 border border-white/20 focus:border-brand-red focus:bg-black/80 rounded text-xs text-white placeholder-white/40 outline-none transition-colors resize-none"
                  />
                </div>

                {/* Consent checkbox */}
                <div className="flex items-start gap-2.5 mt-2">
                  <input
                    type="checkbox"
                    id="consent"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    required
                    className="mt-0.5 w-3.5 h-3.5 accent-brand-red cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-[10px] text-white/60 leading-snug cursor-pointer select-none">
                    {i18n.language === 'en'
                      ? 'I consent to 100% Wrestling Podcast storing and processing my personal data submitted via this form for the purpose of evaluating the proposal and initiating contact.'
                      : 'Doy mi consentimiento para que 100% Wrestling Podcast almacene y procese mis datos personales enviados a través de este formulario con el propósito de evaluar la propuesta comercial e iniciar contacto.'}
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 w-full py-3 rounded-md bg-brand-red hover:bg-brand-red-hover disabled:bg-brand-red/50 text-white font-display font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer shadow-lg shadow-brand-red/10"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {i18n.language === 'en' ? 'Processing...' : 'Procesando...'}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('contact.form.send')}
                    </>
                  )}
                </button>

                {submitStatus === 'error' && (
                  <div className="p-3 bg-brand-red/20 border border-brand-red/40 text-brand-red rounded text-[11px] text-center">
                    {t('contact.validation.errorMessage')}
                  </div>
                )}

              </form>
            )}

          </div>
        </section>

      </div>

    </div>
  );
};
