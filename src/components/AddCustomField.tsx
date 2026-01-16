// import { useState } from "react";

// export default function AddCustomField({
//     onAdd,
// }: {
//     onAdd: (key: string, value: string) => void;
// }) {
//     const [keyName, setKeyName] = useState("");
//     const [value, setValue] = useState("");

//     return (
//         <div className="flex gap-2">
//             <input
//                 className="border p-2 w-1/3"
//                 placeholder="Field name"
//                 value={keyName}
//                 onChange={(e) => setKeyName(e.target.value)}
//             />
//             <input
//                 className="border p-2 flex-1"
//                 placeholder="Value"
//                 value={value}
//                 onChange={(e) => setValue(e.target.value)}
//             />
//             <button
//                 className="border px-3"
//                 onClick={() => {
//                     if (!keyName.trim()) return;
//                     onAdd(keyName.trim(), value);
//                     setKeyName("");
//                     setValue("");
//                 }}
//             >
//                 Add
//             </button>
//         </div>
//     );
// }

import { useState } from "react";
import { Box, TextField, IconButton, Tooltip } from "@mui/material";
import { PlusCircle } from "lucide-react";

interface AddCustomFieldProps {
  onAdd: (key: string, value: string) => void;
}

export default function AddCustomField({ onAdd }: AddCustomFieldProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (key.trim() && value.trim()) {
      onAdd(key.trim(), value.trim());
      setKey("");
      setValue("");
    }
  };

  return (
    <Box className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-dashed border-slate-300">
      <TextField
        size="small"
        placeholder="Rule Key (e.g. City)"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="bg-white"
        sx={{ flex: 1 }}
      />
      <TextField
        size="small"
        placeholder="Value (e.g. London)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="bg-white"
        sx={{ flex: 1 }}
      />
      <Tooltip title="Add Rule">
        <IconButton
          onClick={handleAdd}
          color="primary"
          disabled={!key || !value}
        >
          <PlusCircle />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
