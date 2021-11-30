import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { UseQueryStateResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { SXMap } from "../MUITheme";

const { NODE_ENV } = process.env;

function extractErr(queryState: UseQueryStateResult<any, any>) {
  return NODE_ENV === "development"
            ? JSON.stringify(queryState.error, null, 2)
            : "Something went wrong. Please try again later."
}

export function ErrorView(props: { queryState: UseQueryStateResult<any, any> }) {
  const { queryState } = props;
  return (
    <Box sx={styles.container}>
        <Box width={350} textAlign="center">
          <p>{extractErr(queryState)}</p>
        </Box>
        <Button variant="contained" color='primary' size='large'
          sx={{ mt: 5 }} 
          onClick={() => queryState.refetch()}
        >
          TRY AGAIN
        </Button>
      </Box>
  )
}

const styles: SXMap = {
  container: { 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center',
    minHeight: 500,
    height: '100%',
    width: '100%',
    backgroundColor: 'background.default' 
  }
}