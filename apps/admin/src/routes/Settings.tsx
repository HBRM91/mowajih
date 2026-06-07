export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Paramètres</h1>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 max-w-xl">
        <h3 className="font-semibold text-slate-900 mb-4">Profil de l'université</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
            <input type="text" defaultValue="Université Mundiapolis" className="w-full px-3 py-2 rounded-lg border border-slate-200" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Quota mensuel</label>
            <input type="number" defaultValue={50} className="w-full px-3 py-2 rounded-lg border border-slate-200" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Coût par lead (MAD)</label>
            <input type="number" defaultValue={150} className="w-full px-3 py-2 rounded-lg border border-slate-200" />
          </div>
          <button className="px-6 py-2.5 bg-tawjih-600 text-white rounded-xl font-medium hover:bg-tawjih-700">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
