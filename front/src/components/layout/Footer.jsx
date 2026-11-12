import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * @brief Page footer.
 * @returns {JSX.Element} The footer.
 */
function Footer() {
	const { t } = useTranslation()
	const year = new Date().getFullYear()

	return (
	<footer style={{ borderTop: 'var(--border-thin)', color: 'var(--text-light)' }}
		className="footer w-full px-6 py-4 flex justify-between items-center sticky top-0 z-50">

		<div className="max-w-sm mx-auto flex flex-col items-center gap-6">

		{/* Copyright */}
		<p className="text-xs text-center" style={{ color: 'var(--text-light)' }}>
			© {year} {t('profile.name')} — {t('footer.rights')}
		</p>

		</div>
	</footer>
	)
}

export default Footer
