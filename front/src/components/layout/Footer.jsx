import { useTranslation } from 'react-i18next'
import { GITHUB_PROFILE_URL, LINKEDIN_URL } from '../../lib/links'

/**
 * @brief Page footer: reminder of the contact links, then the copyright.
 * @returns {JSX.Element} The footer.
 */
function Footer() {
	const { t } = useTranslation()
	const year = new Date().getFullYear()

	const links = [
		{ id: 'github', href: GITHUB_PROFILE_URL, label: t('contact.github'), isExternal: true },
		{ id: 'linkedin', href: LINKEDIN_URL, label: t('contact.linkedin'), isExternal: true },
		{ id: 'email', href: `mailto:${t('contact.email')}`, label: t('contact.email-label') },
	]

	return (
		<footer className="footer">
			<nav className="footer__links" aria-label={t('footer.links')}>
				{links.map((link) => (
					<a
						key={link.id}
						className="footer__link"
						href={link.href}
						{...(link.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
					>
						{link.label}
					</a>
				))}
			</nav>

			<p className="footer__copyright">
				© {year} {t('profile.name')} — {t('footer.rights')}
			</p>
		</footer>
	)
}

export default Footer
