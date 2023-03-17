let db;
let sqlite;

const config = {
	locateFile: () =>
		"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm",
};

initSqlJs(config).then((sql) => {
	sqlite = sql;
	db = new sqlite.Database();
});

function executeQuery(query) {
	let rows = [];
	let err = null;

	try {
		rows = db.exec(query);
		console.log(rows);
	} catch (e) {
		err = e.message;
		console.error(e.message);
	}

	return [rows, err];
}

function exportToFile() {
	const dbExported = db.export();
	const a = document.createElement("a");
	a.href = URL.createObjectURL(new Blob([dbExported]), {
		type: "application/octet-stream",
	});
	a.download = `db-${Date.now()}.sqlite`;
	a.click();
	URL.revokeObjectURL(a.href);
}

function importFromFile(fileInput) {
	try {
		const file = fileInput.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			const uint = new Uint8Array(reader.result);
			db = new sqlite.Database(uint);
		};
		reader.readAsArrayBuffer(file);
	} catch (e) {
		console.error(e.message);
	}
}
