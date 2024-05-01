import { useState } from "react";
import { Toaster, toast } from "sonner";
import { uploadFile } from "./services/upload";
import { APP_STATUS, AppStatus, BUTTON_TEXT } from "./constants/constants";
import Search from "./components/Search";
import { type Data } from "./types/Data";
import "./App.css";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [appStatus, setAppStatus] = useState<AppStatus>(APP_STATUS.IDLE);
  const [newData, setNewData] = useState<Data>([]);

  const getButtonText = () => {
    switch (appStatus) {
      case APP_STATUS.READY_UPLOAD:
        return BUTTON_TEXT.UPLOAD;
      case APP_STATUS.UPLOADING:
        return BUTTON_TEXT.UPLOADING;
      default:
        return BUTTON_TEXT.UPLOAD;
    }
  };

  const showButton = () =>
    appStatus === APP_STATUS.READY_UPLOAD || appStatus === APP_STATUS.UPLOADING;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setAppStatus(APP_STATUS.READY_UPLOAD);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || appStatus !== APP_STATUS.READY_UPLOAD) {
      toast.error("Please select a file");
      return;
    }

    setAppStatus(APP_STATUS.UPLOADING);

    const data = await uploadFile(file);

    if (data) {
      setAppStatus(APP_STATUS.READY_USAGE);
      setNewData(data.data);
      toast.success(data.message);
    }

    if (data.message !== "File uploaded successfully") {
      setAppStatus(APP_STATUS.ERROR);
      toast.error(data.message);
      return;
    }
  };

  return (
    <>
      <Toaster />
      <h1>Challenge: Upload + Search</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fileName" className="form-label">
          Upload a file
        </label>
        <input
          onChange={handleInputChange}
          type="file"
          id="fileName"
          name="file"
          accept=".csv"
        />
        {showButton() && (
          <button disabled={appStatus === APP_STATUS.UPLOADING} type="submit">
            {getButtonText()}
          </button>
        )}
      </form>
      <div>
        {newData.length > 0 && (
          <article className="card-grid-layout">
            {newData.map((record) => (
              <div key={record.id} className="card-data">
                <h2>{record.name}</h2>
                <strong>{record.occupation}</strong>
                <p>{record.email}</p>
                <small>
                  Hobbies: <span>{record.hobbies}</span>
                </small>
              </div>
            ))}
          </article>
        )}
      </div>
      {appStatus === APP_STATUS.READY_USAGE && <Search initialData={newData} />}
    </>
  );
}

export default App;
