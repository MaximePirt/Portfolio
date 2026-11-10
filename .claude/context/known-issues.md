# Dettes et problèmes connus

Cocher `[x]` puis supprimer l'entrée au commit suivant quand c'est réglé. Ajouter toute découverte ici.

## i18n
- [ ] `ProjectsSection.jsx` : titre « PROJECTS », sous-titre et `aria-label` en dur.
- [ ] `ProjectsList.jsx` : message vide et `aria-label` en dur (FR).
- [ ] `ProjectDetail.jsx` : libellés « GitHub » / « Demo » en dur.
- [ ] `ProjectPreview.jsx` : `alt` utilise `project.title` (inexistant → « Aperçu de undefined »), devrait utiliser `t(project.titleKey)`.
- [ ] `Banner.jsx` : libellés de nav en dur (ACCUEIL, PRESENTATION…).
- [ ] `Contact.jsx` : liste de stack en dur.

## Styles
- [ ] `index.css` : `--background-img` contient une déclaration cassée (`--bg-shell: #D8D0C1` au milieu d'un gradient) ; `--border-thin` défini deux fois.
- [ ] Variables utilisées mais jamais définies : `--bg-secondary`, `--bg-main`, `--bg-shell`.
- [ ] Dark mode : `--green` et les `--bubble-*` ne sont pas redéfinis ; le choix n'est pas persisté.

## Structure
- [ ] `Contact` rendu deux fois sur `/contact` (route + section fixe dans `App.jsx`).
- [ ] Ancre `#presentation` sans cible ; `pages/Presentation.jsx` non utilisé (et exporte `Home`).
- [ ] `pages/Infos.jsx` et `InfoCards.jsx` quasi inutilisés.
- [ ] `FloatingBubble.jsx` importe `framer-motion` alors que la dépendance déclarée est `motion` (fonctionne car transitive).
- [ ] **`npm run lint` échoue** : `FloatingBubble.jsx:2` — `'motion' is defined but never used` (ESLint ne voit pas l'usage JSX `<motion.div>` : pas de règle `jsx-uses-vars`). Toute édition de ce fichier sera signalée par le hook de lint tant que ce n'est pas corrigé.
- [ ] `CLUSTER_BASE_SIZE` déclaré mais inutilisé dans `HeroSection.jsx`.

## Assets / HTML
- [ ] `/favicon.svg` référencé dans `index.html` mais absent de `public/`.
- [ ] `trailer.mp4` de ft_transcendance référencé mais absent.
- [ ] `index.html` : `lang="en"` alors que la langue par défaut est le français ; pas de meta description.

## Déploiement
- [ ] `nginx/entrypoint.sh` : fallback certificat auto-signé marqué TODO.
