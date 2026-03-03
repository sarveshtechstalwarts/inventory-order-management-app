import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TableSortLabel,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';

const DataTable = ({
  columns,
  rows,
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  onSort,
  sortBy,
  sortOrder,
  searchable = false,
  onSearch,
  searchPlaceholder = 'Search...',
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSort = (columnId) => {
    if (onSort) {
      const newOrder =
        sortBy === columnId && sortOrder === 'asc' ? 'desc' : 'asc';
      onSort(columnId, newOrder);
    }
  };

  return (
    <Paper>
      {searchable && (
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{ fontWeight: 600 }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={
                        sortBy === column.id ? sortOrder : 'asc'
                      }
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={row.id || index} hover>
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align || 'left'}>
                      {column.render
                        ? column.render(row[column.id], row)
                        : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {onPageChange && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={(e, newPage) => onPageChange(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            onRowsPerPageChange(parseInt(e.target.value, 10))
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </Paper>
  );
};

export default DataTable;
