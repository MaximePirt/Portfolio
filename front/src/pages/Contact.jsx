import '../styles/contact.css'

function ContactSection() {
	return (
		<section className="contact-section" id="contact">
			<div className="contact-shell">
				<div className="contact-layout">
					<div className="contact-copy">
						<p className="contact-copy__eyebrow">Contact</p>

						<h2 className="contact-copy__title">
							Parlons de votre projet.
						</h2>

						<p className="contact-copy__text">
							Je conçois et développe des applications web claires, rapides et maintenables.
							Si vous avez besoin d’un site, d’une interface React ou d’un backend Node.js,
							je serai ravi d’en discuter.
						</p>

						<div className="contact-actions">
							<a
								className="contact-button contact-button--primary"
								href="mailto:tonemail@exemple.com"
							>
								M’écrire par email
							</a>

							<a
								className="contact-button contact-button--ghost"
								href="https://github.com/MaximePirt"
								target="_blank"
								rel="noopener noreferrer"
							>
								Voir mon GitHub
							</a>
						</div>
					</div>

					<aside className="contact-card">
						<div className="contact-card__block">
							<p className="contact-card__label">Email</p>
							<a href="mailto:tonemail@exemple.com" className="contact-card__value">
								tonemail@exemple.com
							</a>
						</div>

						<div className="contact-card__block">
							<p className="contact-card__label">Basé à</p>
							<p className="contact-card__value">Saint-Nazaire, France</p>
						</div>

						<div className="contact-card__block">
							<p className="contact-card__label">Stack</p>
							<p className="contact-card__value">
								React · Node.js · Fastify · PostgreSQL
							</p>
						</div>

						<div className="contact-card__block">
							<p className="contact-card__label">Disponibilité</p>
							<p className="contact-card__value">
								Ouvert aux missions freelance et aux projets web sur mesure
							</p>
						</div>
					</aside>
				</div>
			</div>
		</section>
	)
}

export default ContactSection
