interface ServerStatusProps {
  status: 'normal' | 'abnormal';
}

function ServerStatus({ status }: ServerStatusProps) {
  const isNormal = status === 'normal';
  
  return (
    <div 
      className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium ${
        isNormal 
          ? 'bg-green-50 text-green-700 border border-green-200' 
          : 'bg-red-50 text-red-700 border border-red-200'
      }`}
      title={`Server connection: ${isNormal ? 'Normal' : 'Communication abnormality'}`}
    >
      <div className={`w-2 h-2 rounded-full ${
        isNormal ? 'bg-green-500' : 'bg-red-500'
      }`} />
      <span>
        {isNormal ? 'Connection Server' : 'Communication abnormality'}
      </span>
    </div>
  );
}

export default ServerStatus;
