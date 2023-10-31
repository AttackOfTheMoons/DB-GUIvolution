import React from "react";
import { Panel } from "reactflow";

const NodePanel = ({ setVariant }) => {
	return (
		<Panel position={"top-left"}>
			<button
				className="panel-button"
				type="button"
				onClick={() => setVariant("dots")}
			>
				·
			</button>
			<button
				className="panel-button"
				type="button"
				onClick={() => setVariant("lines")}
			>
				—
			</button>
			<button
				className="panel-button"
				type="button"
				onClick={() => setVariant("cross")}
			>
				+
			</button>
		</Panel>
	);
};

export default NodePanel;
