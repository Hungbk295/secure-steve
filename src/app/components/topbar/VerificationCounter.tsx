interface VerificationCounterProps {
  count: number;
  onClick: () => void;
}

function VerificationCounter({ count, onClick }: VerificationCounterProps) {
  if (count === 0) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 px-3 py-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-md transition-colors"
      title={`${count} verification requests pending`}
    >
      <i className="ri-file-list-3-line text-orange-600" />
      <span className="text-sm font-medium text-orange-800">
        Verification required
      </span>
      <span className="bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
        {count > 99 ? '99+' : count}
      </span>
    </button>
  );
}

export default VerificationCounter;
