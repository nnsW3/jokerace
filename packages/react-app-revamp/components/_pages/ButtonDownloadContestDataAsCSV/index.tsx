import Button from "@components/UI/Button";
import button from "@components/UI/Button/styles";
import Loader from "@components/UI/Loader";
import { CSV_COLUMNS_HEADERS } from "@config/react-csv/export-contest";
import { useExportContestDataToCSV } from "@hooks/useExportContestDataToCSV/useExportContestDataToCSV";
import useProposal from "@hooks/useProposal";
import { useProposalStore } from "@hooks/useProposal/store";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { CSVLink } from "react-csv";

export const ButtonDownloadContestDataAsCSV = () => {
  const { fetchProposalsPage } = useProposal();
  const { asPath } = useRouter();
  const {
    hasPaginationProposalsNextPage,
    indexPaginationProposals,
    totalPagesPaginationProposals,
    currentPagePaginationProposals,
  } = useProposalStore(state => state);

  const { stateExportData, formatContestCSVData, queryContestResults } = useExportContestDataToCSV();
  async function startDownloading() {
    stateExportData.setLoadingMessage("Loading remaining proposals data...");
    stateExportData.setIsReady(false);
    try {
      if (hasPaginationProposalsNextPage) {
        const loadAllContestData = [];
        for (let i = currentPagePaginationProposals; i < totalPagesPaginationProposals - 1; i++) {
          loadAllContestData.push(
            fetchProposalsPage(i + 1, indexPaginationProposals[i + 1], totalPagesPaginationProposals),
          );
        }
        await Promise.all(loadAllContestData);
      }
      stateExportData.setIsReady(true);
    } catch (e) {
      stateExportData.setIsReady(false);
      console.error(e);
    }
  }

  useEffect(() => {
    if (stateExportData.shouldStart) startDownloading();
  }, [stateExportData.shouldStart]);

  useEffect(() => {
    if (stateExportData.isReady) formatContestCSVData();
  }, [stateExportData.isReady]);

  if (queryContestResults.isLoading)
    return (
      <div className="animate-appear mb-5">
        <Loader scale="component">{stateExportData.loadingMessage}</Loader>
      </div>
    );

  if (queryContestResults.isSuccess && stateExportData.cid !== null && !stateExportData.isSuccess)
    return (
      <a
        className={button({ intent: "primary-outline" })}
        href={`https://${stateExportData.cid}.ipfs.w3s.link/result_contest_${asPath.split("/")[3]}_${
          asPath.split("/")[2]
        }.csv`}
        download
      >
        Download CSV file
      </a>
    );

  if (!stateExportData.shouldStart)
    return (
      <>
        <Button
          className="animate-appear"
          intent="neutral-outline"
          onClick={() => stateExportData.setShouldStart(true)}
          type="button"
        >
          Start exporting data
        </Button>
      </>
    );
  return (
    <>
      {(stateExportData.isLoading || !stateExportData.isReady) && (
        <>
          <p className="animate-appear p-3 mt-4 rounded-md border-solid border mb-5 text-sm font-bold bg-primary-1 text-primary-10 border-primary-4">
            Make sure to not leave this page until the export is complete.
          </p>
          <div className="animate-appear mb-5">
            <Loader scale="component">{stateExportData.loadingMessage}</Loader>
          </div>
        </>
      )}
      {stateExportData.isSuccess ? (
        <div className="animate-appear">
          <p className={`font-bold text-sm text-primary-10`}>{stateExportData.loadingMessage}</p>
        </div>
      ) : (
        stateExportData.error && (
          <div className="animate-appear">
            <p className="text-sm font-bold mb-5 text-negative-10">
              Something went wrong while preparing the data. Please try again.
            </p>

            <Button onClick={async () => await formatContestCSVData()} intent="neutral-outline">
              Try again
            </Button>
          </div>
        )
      )}
      {stateExportData.isSuccess && (
        <div className="mt-6 animate-appear">
          {/* @ts-ignore */}
          <CSVLink
            filename={`jokedao-contest-data-${format(new Date(), "yyyy-MM-dd")}.csv`}
            className={button({ intent: "primary-outline" })}
            data={stateExportData.csv}
            headers={CSV_COLUMNS_HEADERS}
          >
            Download CSV file
          </CSVLink>
        </div>
      )}
    </>
  );
};

export default ButtonDownloadContestDataAsCSV;
