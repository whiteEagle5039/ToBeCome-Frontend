## Envoi des accès parents

Les endpoints ci-dessous permettent d'envoyer aux parents un lien pour définir leur mot de passe et accéder à leur espace.

Toutes les routes sont accessibles via le préfixe `/api/admin` et nécessitent une authentification JWT avec le rôle `ADMIN`.

Le message envoyé ne contient pas le mot de passe en clair. Il contient un lien de réinitialisation/définition de mot de passe.

### 1) Envoi à un parent spécifique

`POST /api/admin/parents/send-access`

Payload attendu :

```json
{
  "parentId": "id-du-parent"
}
```

Réponse attendue :

```json
{
  "sent": 1,
  "total": 1,
  "results": [
    {
      "parentId": "id-du-parent",
      "email": "parent@example.com",
      "success": true
    }
  ]
}
```

Si le parent n'existe pas, l'API renvoie une erreur.

### 2) Envoi à tous les parents

`POST /api/admin/parents/send-access`

Payload attendu :

```json
{}
```

Réponse attendue :

```json
{
  "sent": 42,
  "total": 45,
  "results": [
    {
      "parentId": "id-parent-1",
      "email": "parent1@example.com",
      "success": true
    },
    {
      "parentId": "id-parent-2",
      "email": "parent2@example.com",
      "success": false,
      "error": "Email manquant"
    }
  ]
}
```

### Comportement

- Un token de réinitialisation est généré pour chaque parent ciblé.
- Un email d'accès est envoyé avec un lien vers la page de définition du mot de passe.
- Si un parent n'a pas d'email lié à son compte, l'élément correspondant remonte avec `success: false`.

### Remarque

Cette route est utile pour:
- activer un parent après création/import
- renvoyer un accès à un parent qui a perdu son lien
- déclencher un envoi massif après import de plusieurs parents

## Gestion des parents par établissement

### 3) Lister tous les parents d'un établissement

`GET /api/admin/etablissements/:etablissementId/parents`

Retourne la liste complète de tous les parents associés aux élèves d'un établissement spécifique.

Réponse attendue :

```json
{
  "total": 24,
  "parents": [
    {
      "parentId": "id-parent-1",
      "prenom": "Jean",
      "nom": "Dupont",
      "email": "jean.dupont@example.com",
      "telephone": "+229 XX XXX XXX",
      "enfants": [
        {
          "eleveId": "id-eleve-1",
          "nomEleve": "Marie Dupont",
          "lienParente": "Mère"
        },
        {
          "eleveId": "id-eleve-2",
          "nomEleve": "Pierre Dupont",
          "lienParente": "Père"
        }
      ],
      "createdAt": "2026-02-15T10:30:00Z"
    },
    {
      "parentId": "id-parent-2",
      "prenom": "Sophie",
      "nom": "Martin",
      "email": "sophie.martin@example.com",
      "telephone": null,
      "enfants": [
        {
          "eleveId": "id-eleve-3",
          "nomEleve": "Luc Martin",
          "lienParente": "Mère"
        }
      ],
      "createdAt": "2026-03-20T14:15:00Z"
    }
  ]
}
```

### 4) Rechercher des parents dans un établissement

`POST /api/admin/etablissements/:etablissementId/parents/search`

Permet de chercher des parents spécifiques par nom, prénom ou email.

Payload attendu :

```json
{
  "q": "dupont",
  "limit": 50
}
```

Paramètres optionnels :
- `q` : terme de recherche (cherche dans prenom, nom, email)
- `limit` : nombre maximum de résultats (défaut: 50)

Réponse attendue :

```json
{
  "total": 2,
  "parents": [
    {
      "parentId": "id-parent-1",
      "prenom": "Jean",
      "nom": "Dupont",
      "email": "jean.dupont@example.com",
      "telephone": "+229 XX XXX XXX",
      "enfants": [
        {
          "eleveId": "id-eleve-1",
          "nomEleve": "Marie Dupont",
          "lienParente": "Mère"
        }
      ],
      "createdAt": "2026-02-15T10:30:00Z"
    }
  ]
}
```

Si aucun résultat : retourne `{ "total": 0, "parents": [] }`
