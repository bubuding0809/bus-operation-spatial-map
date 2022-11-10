import { type NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useState } from "react";
import GoogleMapWindow from "../components/GoogleMapWindow";
import data from "../data/cleaned_data.json";
import useColorMap from "../hooks/useColorMap";
import { FilterConfiguration } from "../utils/types";

const center = {
  lat: 1.356544802537712,
  lng: 103.81982421875,
};

const getFilterConfiguration = () => {
  const config: FilterConfiguration = {
    selected: "driverFilter",
    eventFilter: {},
    driverFilter: {},
  };

  const drivers = new Set<string>();
  const events = new Set<string>();

  data.forEach((d) => {
    drivers.add(d.Driver);
    events.add(d.Event);
  });

  drivers.forEach((d) => (config.driverFilter[d] = true));
  events.forEach((e) => (config.eventFilter[e] = true));

  return config;
};

const Home: NextPage = () => {
  const [selected, setSelected] = useState<"Event" | "Driver">("Driver");
  const [selectAll, setSelectAll] = useState(true);

  const [filterConfiguration, setFilterConfiguration] =
    useState<FilterConfiguration>(() => getFilterConfiguration());
  const colorMap = useColorMap(data, selected);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFilterConfiguration((prev) => {
      const newConfig = { ...prev };
      if (prev.selected === "driverFilter") {
        newConfig.driverFilter[value] = checked;
      } else {
        newConfig.eventFilter[value] = checked;
      }
      return newConfig;
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelected(value as "Event" | "Driver");
    setFilterConfiguration((prev) => ({
      ...prev,
      selected: (value.toLowerCase() + "Filter") as
        | "driverFilter"
        | "eventFilter",
    }));
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFilterConfiguration((prev) => {
      const newConfig = { ...prev };
      if (prev.selected === "driverFilter") {
        console.log("toggling events");

        Object.keys(newConfig.driverFilter).forEach(
          (k) => (newConfig.driverFilter[k] = checked)
        );
      } else {
        console.log("toggling events");
        Object.keys(newConfig.eventFilter).forEach(
          (k) => (newConfig.eventFilter[k] = checked)
        );
      }
      return newConfig;
    });
    setSelectAll(checked);
  };

  return (
    <>
      <Head>
        <title>Bus operation analysis</title>
        <meta name="description" content="TLM 2003 - Group Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-start bg-[#252525] p-10">
        <h1 className="whitespace-nowrap text-4xl font-extrabold leading-normal text-slate-100">
          Bus operation analysis
        </h1>
        <div className="flex gap-2 py-2">
          <div className="flex w-full flex-wrap gap-2 rounded-lg border bg-[#F7F7F7] p-2 shadow-sm">
            <div className="flex h-10 min-w-fit items-center justify-center gap-1 rounded-lg bg-emerald-300 px-4">
              <label htmlFor="filter-select" className="font-bold">
                Filter
              </label>
              <select
                id="filter-select"
                onChange={handleSelectChange}
                className="rounded"
              >
                <option value="Driver">Driver</option>
                <option value="Event">Event</option>
              </select>
            </div>
            {Array.from(colorMap.entries()).map(([key, value]) => {
              return (
                <div
                  key={key}
                  className="flex h-10 min-w-fit items-center justify-center gap-1 rounded-lg bg-slate-200 px-4"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={
                      filterConfiguration[filterConfiguration.selected][key]
                    }
                    onChange={(e) => handleConfigChange(e)}
                    value={key}
                  />
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: value }}
                  ></div>
                  <p>{key}</p>
                </div>
              );
            })}
            <label htmlFor="select-all" className="flex items-center gap-1">
              <span>Select all</span>
              <input
                type="checkbox"
                id="select-all"
                onChange={handleSelectAllChange}
                checked={selectAll}
              />
            </label>
          </div>
        </div>
        <GoogleMapWindow
          center={center}
          data={data}
          filterConfiguration={filterConfiguration}
          colorMap={colorMap}
          column={selected}
        />
      </main>
    </>
  );
};

export default Home;
