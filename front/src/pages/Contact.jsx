import '../styles/contact.css'
import { useTranslation } from 'react-i18next'

function ContactSection() {
	const { t } = useTranslation()
	return (
		<section className="contact-section" id="contact">
			<div className="contact-shell">
				<div className="contact-layout">
					<div className="contact-copy">
						<p className="contact-copy__eyebrow">{t('contact.contact')}</p>

						<h2 className="contact-copy__title">
							{t('contact.title')}
						</h2>

						<p className="contact-copy__text">
							{t('contact.subtitle')} <br />
							{t('contact.text')}
						</p>

						<div className="contact-actions">
							<a
								className="contact-button contact-button--primary"
								href={`mailto:${t('contact.email')}`}
							>
								{t('contact.mailText')}
							</a>

							<a
								className="contact-button contact-button--ghost"
								href="www.linkedin.com/in/maxime-pierrot-42479420b"
								target="_blank"
								rel="noopener noreferrer"
							>
								{t('contact.linkedinText')}
							</a>
						</div>
					</div>

					<aside className="contact-card">
						<div className="contact-card__block">
							<p className="contact-card__label">{t('contact.email-label')}</p>
							<a href={`mailto:${t('contact.email')}`} className="contact-card__value">
								{t('contact.email')}
							</a>
						</div>

						<div className="contact-card__block">
							<p className="contact-card__label">{t('contact.label-location')}</p>
							<p className="contact-card__value">{t('contact.location')}</p>
						</div>

						<div className="contact-card__block">
							<p className="contact-card__label">{t('contact.stack-label')}</p>
							<p className="contact-card__value">
								React · TypeScript · Fastify · Node.js · SQLite  · Nginx · Docker
								· Git · CI/CD · HashiCorp Vault  
							</p>
						</div>

						<div className="contact-card__block">
							<p className="contact-card__label">{t('contact.availability-label')}</p>
							<p className="contact-card__value">
								{t('contact.availability')}
							</p>
						</div>
					</aside>
				</div>
			</div>
		</section>
	)
}

export default ContactSection
