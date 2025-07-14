import { Log } from '../utils/logger';
import { DataGrid } from '@mui/x-data-grid';
import { formatDistanceToNow } from 'date-fns';

function StatisticsPage({ urls }) {
  useEffect(() => {
    Log('frontend', 'info', 'api', 'Accessed statistics page');
  }, []);

  const [selectedUrl, setSelectedUrl] = useState(null);

  const columns = [
    { field: 'shortUrl', headerName: 'Short URL', width: 200 },
    { field: 'clicks', headerName: 'Clicks', width: 100 },
    { field: 'createdAt', headerName: 'Created', width: 200 },
    { field: 'expiresAt', headerName: 'Expires', width: 200 },
    {
      field: 'actions',
      headerName: 'Details',
      width: 120,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => setSelectedUrl(params.row)}
        >
          View Clicks
        </Button>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        rows={urls}
        columns={columns}
        pageSize={5}
        onRowClick={(params) => {
          Log('frontend', 'debug', 'api', 'Viewed URL details', {
            shortUrl: params.row.shortUrl
          });
        }}
      />
      
      <Dialog open={!!selectedUrl} onClose={() => setSelectedUrl(null)}>
        <DialogTitle>Click Details - {selectedUrl?.shortCode}</DialogTitle>
        <List sx={{ width: 500 }}>
          {selectedUrl?.clicks?.map((click, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${formatDistanceToNow(new Date(click.timestamp))} ago`}
                secondary={`From: ${click.source} | Location: ${click.location}`}
              />
            </ListItem>
          ))}
        </List>
      </Dialog>
    </>
  );
}