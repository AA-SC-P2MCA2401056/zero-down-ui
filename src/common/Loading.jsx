import { useLoading } from "./LoadingContext";

const Loading = () => {
  const { loading } = useLoading();

  if (!loading) return null;

 return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50 z-50">
      <div className="relative w-40 h-40">
        {/* Spinner ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-t-8 border-amber-400 border-opacity-75 border-r-transparent border-b-transparent border-l-transparent"></div>

        {/* Centered GIF */}
        <img
          src="src\assets\Walking Orange.gif" 
          alt="Loading..."
          className="absolute inset-0 w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Loading;

