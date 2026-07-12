# Contrat API Frontend → Backend (port 4000)

Le frontend appelle `NEXT_PUBLIC_API_URL` (défaut : `http://localhost:4000`) via **axios**.

## Auth

| Méthode | Route | Body |
|---------|-------|------|
| POST | `/api/auth/parent/login` | `{ email, password }` |
| POST | `/api/auth/parent/register` | `{ firstName, lastName, email, phone, password }` |
| POST | `/api/auth/parent/forgot-password` | `{ email }` |
| POST | `/api/auth/eleve/login` | `{ matricule, password }` |
| POST | `/api/auth/eleve/register` | `{ matricule, birthDate, password, firstName, lastName, avatarIcon, niveau }` |
| POST | `/api/auth/eleve/verify-matricule` | `{ matricule, birthDate }` |
| POST | `/api/auth/etablissement/login` | `{ email, password }` |

Réponse auth : `{ token: string, user: object }` — le token est stocké en `localStorage` et envoyé en `Authorization: Bearer`.

## Parent — `/api/parent/*`

- `GET /profile` · `PUT /profile`
- `GET /children` · `POST /children` · `GET /children/:id`
- `POST /children/:id/comments`
- `GET /children/:id/report`
- `GET /notifications` · `PATCH /notifications/:id/read` · `PATCH /notifications/read-all`
- `GET /notification-settings` · `PUT /notification-settings`

## Élève — `/api/eleve/*`

- `GET /profile` · `PUT /profile` · `PUT /password`
- `GET /missions` · `POST /missions/:id/submit`
- `GET /progress`
- `GET /riasec` · `POST /riasec/submit`
- `POST /favorites/:careerId` · `POST /careers/:id/explore`
- `GET /notifications` · `PATCH /notifications/:id/read`

## Établissement — `/api/etablissement/*`

- `GET /dashboard`
- `GET /eleves` · `GET /eleves/:id` · `POST /eleves/import` · `POST /eleves/export`
- `GET /classes` · `POST /classes` · `PUT /classes/:id` · `DELETE /classes/:id`
- `GET /communication/historique` · `POST /communication/send`
- `GET /alertes` · `POST /alertes/:id/rappel`
- `GET /rapports` · `POST /rapports/generate` · `POST /rapports/:id/whatsapp`
- `GET /matricules` · `POST /matricules/generate`
- `GET /abonnement`
- `GET /parametres` · `PUT /parametres` · `PUT /password`

## Métiers — `/api/metiers/*`

- `GET /domaines` · `GET /` · `GET /:idOrSlug` · `POST /suggest`

Types détaillés : `types/etablissement.ts`, `lib/parent/types.ts`, `lib/eleve/types.ts`.
