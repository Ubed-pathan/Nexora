import { useState } from "react";
import { Bounce, toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { XCircle } from "lucide-react";

interface AddPostFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  postAddedSuccess: boolean;
  setPostAddedSuccess: (postAddedSuccess: boolean) => void;
}

export const AddPostFrom: React.FC<AddPostFormProps> = ({
  isOpen,
  setIsOpen,
  postAddedSuccess,
  setPostAddedSuccess,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleAddPost = async () => {
    if (!description || !image) {
      toast.error("⚠️ Please add an image and description!", {
        position: "top-center",
        autoClose: 1200,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }

    if (image) {
      const fileSizeMB = image.size / (1024 * 1024); // Convert bytes to MB
      if (fileSizeMB > 5) {
        toast.error("📁 Image size must be less than 5MB!", {
          position: "top-center",
          autoClose: 1200,
          theme: "dark",
          transition: Bounce,
        });
        return;
      }
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("file", image);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/post`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("😄 Post added successfully", {
          position: "top-center",
          autoClose: 1000,
          theme: "dark",
          transition: Bounce,
        });
        setPostAddedSuccess(!postAddedSuccess);
        setTimeout(() => {
          setImage(null);
          setPreview(null);
          setDescription("");
          setIsOpen(false);
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      toast.error("😓 Failed to add post", {
        position: "top-center",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });

      setTimeout(() => {
        setImage(null);
        setPreview(null);
        setDescription("");
        setIsOpen(false);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="relative">
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-bg-100 p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Create a Post</h2>

            <textarea
              className="w-full border border-gray-500 rounded-lg p-2 mb-1 bg-bg-200 resize-none text-sm leading-relaxed break-words"
              rows={4}
              placeholder="What's on your mind?"
              value={description}
              maxLength={150}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <div className="text-right text-xs text-gray-400 mb-3">
              {description.length} / 150
            </div>

            <label className="block border border-gray-500 bg-bg-200 rounded-lg p-3 cursor-pointer text-center text-gray-600 hover:bg-bg-300 transform duration-500">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {image ? "Change Image" : "Upload Image"}
            </label>

            {preview && (
              <div className="relative mt-4">
                <img
                  src={preview}
                  alt="Uploaded"
                  className="w-full max-h-[50vh] rounded-lg shadow-lg object-contain"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                >
                  <XCircle size={20} />
                </button>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2"
                disabled={loading} // Disable when loading
              >
                Cancel
              </button>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                onClick={handleAddPost}
                disabled={loading} // Disable when loading
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
};
