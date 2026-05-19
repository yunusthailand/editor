export default function ErrorModal({ error, onClose }) {
  if (!error) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl">
        <p className="mb-4 text-red-500">{error}</p>

        <button
          className="bg-primary text-white px-4 py-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
