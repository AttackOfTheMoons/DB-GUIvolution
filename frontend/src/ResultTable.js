import React from "react";
const ResultTable = ({ keys, data }) => (
	<aside>
		<table>
			<thead>
				<tr>
					{keys.map((key) => (
						<th key={key.toString()}>{key}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.map((row, rowIndex) => (
					<tr key={rowIndex.toString()}>
						{row.map((cell, cellIndex) => (
							<td key={cellIndex.toString()}>{cell}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	</aside>
);

export default ResultTable;
