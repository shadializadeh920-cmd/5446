import { CaretDownOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React, { useState } from "react";

const Search = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  return (
    <div className="text-right border border-zinc-200 m-4 rounded overflow-hidden">
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="bg-zinc-200 p-2 flex items-center justify-end gap-2 cursor-pointer"
      >
        جستجو
        <CaretDownOutlined
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {open && (
        <div className="pt-1" onClick={(e) => e.stopPropagation()}>
          <h2 className="p-2">نام</h2>

          <div className="relative">
            <Input
              className="text-right h-8 !mt-1 !mb-2 !mx-2 !w-[calc(100%-1rem)]"
              placeholder="نام را وارد کنید"
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="absolute top-2 left-3 text-gray-500 text-sm">
              {name.length}/50
            </span>
          </div>

          <div className="p-1 flex justify-end gap-2">
            <Button>تنظیم مجدد</Button>
            <Button type="primary">جستجو</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
