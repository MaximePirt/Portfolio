import '../styles/contact.css'
import { useTranslation } from 'react-i18next'
import useReveal from '../components/ui/useReveal'

/**
 * @brief Contact section with the ways to reach me.
 * @returns {JSX.Element} The section.
 */
function ContactSection() {
	const { t } = useTranslation()
	const [shellRef, isRevealed] = useReveal()

	return (
		<section className="contact-section" id="contact">
			<div ref={shellRef} className={`contact-shell ${isRevealed ? 'is-revealed' : ''}`}>
				<div className="contact-layout">
					<div className="contact-copy reveal">
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
								href="https://www.linkedin.com/in/maxime-pierrot-42479420b"
								target="_blank"
								rel="noopener noreferrer"
							>
								{t('contact.linkedinText')}
							</a>
						</div>
					</div>

					<aside className="contact-card reveal" style={{ '--reveal-index': 2 }}>
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
