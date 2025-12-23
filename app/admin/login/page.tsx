export default function AdminLoginPage() {
  return (
    <div style={{ padding: 16, maxWidth: 420 }}>
      <h1>Admin login</h1>
      <form method="POST" action="/api/admin/login" style={{ display: "grid", gap: 10 }}>
        <label>Utilisateur</label>
        <input name="user" defaultValue="admin" />

        <label>Mot de passe</label>
        <input name="pass" type="password" />

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
