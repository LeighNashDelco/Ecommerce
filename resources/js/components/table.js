import React from "react";

import {
  FaSquare, // For unchecked checkbox icon
} from "react-icons/fa";
import { IconTrash, IconEdit } from "@tabler/icons-react"; // For trash and edit icons

const Table = ({ headers = ["Username", "Email", "Roles", "Created at", "Updated at"], data }) => {
  // Default to 5 empty rows if no data is provided
  const tableData = data || Array.from({ length: 5 }, (_, index) => ({ id: index }));

  return (
    <div className="user-table">
      <table>
        <thead>
          <tr>
            <th>
              <div className="header-actions-icon">
                <FaSquare className="checkbox-icon" />
                Actions
              </div>
            </th>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>
                <div className="action-icons">
                  <FaSquare className="checkbox-icon" size={16} />
                  <IconTrash size={16} className="delete-icon" />
                  <IconEdit size={16} className="edit-icon" />
                </div>
              </td>
              {headers.map((_, colIndex) => (
                <td key={colIndex}></td> // Empty cells by default, can be customized via data prop
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;