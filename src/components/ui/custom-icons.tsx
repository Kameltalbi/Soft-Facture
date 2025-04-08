
import { File } from "lucide-react";

export const FileExcel = (props: React.ComponentProps<typeof File>) => (
  <div className="relative">
    <File {...props} className={`text-green-600 ${props.className || ""}`} />
    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-[8px] font-bold">
      XLSX
    </span>
  </div>
);

export const FileCsv = (props: React.ComponentProps<typeof File>) => (
  <div className="relative">
    <File {...props} className={`text-blue-600 ${props.className || ""}`} />
    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-[8px] font-bold">
      CSV
    </span>
  </div>
);
