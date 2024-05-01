import { useEffect, useState } from "react";
import { type Data } from "../types/Data";
import { searchData } from "../services/search";
import { useDebounce } from "@uidotdev/usehooks";
import { DEBOUNCE_DELAY } from "../constants/constants";
import { toast } from "sonner";

function Search({ initialData }: { initialData: Data }) {
  const [data, setData] = useState<Data>(initialData);
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    const search = new URLSearchParams(window.location.search).get("query");
    return search ?? ""; // if the search term is null, return an empty string instead
  });

  const debouncedSearch = useDebounce(searchTerm, DEBOUNCE_DELAY);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  useEffect(() => {
    if (!debouncedSearch) {
      window.history.pushState({}, "", window.location.pathname); // remove the query params from the URL if the search term is empty
    }

    window.history.pushState({}, "", `?query=${debouncedSearch}`); // add the query params to the URL
  }, [debouncedSearch]);

  useEffect(() => {
    if (!debouncedSearch) {
      setData(initialData);
      return;
    }

    // call the search API
    searchData(debouncedSearch)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error searching data");
      });
  }, [debouncedSearch, initialData]);

  return (
    <div className="form-search">
      <form>
        <input
          onChange={handleSearch}
          type="search"
          placeholder="Search"
          defaultValue={searchTerm}
        />
      </form>

      <div className="card-grid-layout">
        {data.map((record, index) => (
          <div key={record.id + index} className="card-data-filtered">
            {Object.entries(record).map(([key, value]) => {
              return (
                <p key={key}>
                  <strong>{key}: </strong>
                  <span>{value}</span>
                </p>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
