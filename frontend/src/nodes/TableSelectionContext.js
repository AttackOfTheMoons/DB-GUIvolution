import { createContext, useContext, useState } from "react";

export const TableSelectionContext = createContext();

export function useTableSelection() {
	return useContext(TableSelectionContext);
}

export function TableSelectionProvider({ children }) {
	const [selectedTable, setSelectedTable] = useState("");

	return (
		<TableSelectionContext.Provider value={{ selectedTable, setSelectedTable }}>
			{children}
		</TableSelectionContext.Provider>
	);
}
