import '../styles/contact.css'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import BubbleCluster from '../components/ui/BubbleCluster'
import SectionHeader from '../components/ui/SectionHeader'
import useReveal from '../components/ui/useReveal'
import { LINKEDIN_URL } from '../lib/links'
import { STACK } from '../lib/profile'

// Reminder of the intro motif, on both sides of the contact card (in % of each cluster).
const FLOAT = { floatY: 8, floatRotate: 3, repelRadius: 170, repelForce: 60 }

const LEFT_SHAPES = [
	{ id: 1, x: 30, y: 30, size: 30, delay: 0.1, variant: 'bubble-green-light', ...FLOAT },
	{ id: 2, x: 68, y: 52, size: 18, delay: 0.35, variant: 'bubble-grey', ...FLOAT },
	{ id: 3, x: 38, y: 74, size: 22, delay: 0.2, variant: 'bubble-orange', ...FLOAT },
]

const RIGHT_SHAPES = [
	{ id: 1, x: 62, y: 26, size: 22, delay: 0.25, variant: 'bubble-grey', ...FLOAT },
	{ id: 2, x: 34, y: 48, size: 16, delay: 0, variant: 'bubble-green-dark', ...FLOAT },
	{ id: 3, x: 64, y: 70, size: 28, delay: 0.4, variant: 'bubble-green-light', ...FLOAT },
]

/**
 * @brief Contact section, closing the page: invitation, the two ways to reach me, then the key facts,
 * framed by bubbles that recall the intro.
 * @returns {JSX.Element} The section.
 */
function ContactSection() {
	const { t } = useTranslation()
	const sectionRef = useRef(null)
	const [shellRef, isRevealed] = useReveal()
	const email = t('contact.email')

	return (
		<section ref={sectionRef} className="contact-section" id="contact">
			<BubbleCluster sectionRef={sectionRef} shapes={LEFT_SHAPES} className="contact-bubbles contact-bubbles--left" />
			<BubbleCluster sectionRef={sectionRef} shapes={RIGHT_SHAPES} className="contact-bubbles contact-bubbles--right" />

			<div ref={shellRef} className={clsx('contact-shell', isRevealed && 'is-revealed')}>
				<SectionHeader
					eyebrow={t('contact.contact')}
					title={t('contact.title')}
					subtitle={t('contact.subtitle')}
				/>

				<p className="contact-text reveal" style={{ '--reveal-index': 1 }}>
					{t('contact.text')}
				</p>

				<div className="contact-actions reveal" style={{ '--reveal-index': 2 }}>
					<a className="button button--primary" href={`mailto:${email}`}>
						{t('contact.mailText')}
					</a>

					<a
						className="button button--ghost"
						href={LINKEDIN_URL}
						target="_blank"
						rel="noopener noreferrer"
					>
						{t('contact.linkedinText')}
					</a>
				</div>

				<aside className="contact-card reveal" style={{ '--reveal-index': 3 }}>
					<div className="contact-card__block">
						<p className="contact-card__label">{t('contact.email-label')}</p>
						<a href={`mailto:${email}`} className="contact-card__value">
							{email}
						</a>
					</div>

					<div className="contact-card__block">
						<p className="contact-card__label">{t('contact.label-location')}</p>
						<p className="contact-card__value">{t('contact.location')}</p>
						<p className="contact-card__note">{t('contact.mobility')}</p>
					</div>

					<div className="contact-card__block">
						<p className="contact-card__label">{t('contact.stack-label')}</p>
						<p className="contact-card__value">{STACK.join(' · ')}</p>
					</div>

					<div className="contact-card__block">
						<p className="contact-card__label">{t('contact.availability-label')}</p>
						<p className="contact-card__value">
							{t('contact.availability')}
						</p>
					</div>
				</aside>
			</div>
		</section>
	)
}

export default ContactSection
