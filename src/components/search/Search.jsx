import { CaretDownOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import React from "react";
import { useState } from "react";

const Search = () => {
  const [name, setName] = useState("");
  return (
    <div className="  text-right border border-zinc-200 m-4 rounded">
      <h2 className="bg-zinc-200 p-2 flex items-center justify-end gap-2">
        جستجو
        <Select />
      </h2>
      <h2 className="p-2">نام</h2>
      <div className="relative">
        <Input
          className="text-right h-8 !mt-1 !mb-2 !mx-2 !w-[calc(100%-1rem)]  "
          placeholder="نام را وارد کنید"
          value={name}
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="absolute top-2 left-3 text-gray-500 text-sm">
          {name.length}/50
        </span>
      </div>
      <div className="p-1 justify-end  flex gap-2">
        <Button>تنظیم مجدد</Button>
        <Button>جستجو</Button>
      </div>
    </div>
  );
};

export default Search;
