import { chains } from "@config/wagmi";
import { extractPathSegments } from "@helpers/extractPath";
import useContractVersion from "@hooks/useContractVersion";
import { compareVersions } from "compare-versions";
import { usePathname } from "next/navigation";
import { FC } from "react";
import ProposalStatisticsTotalVotes from "./components/TotalVotes";
import ProposalStatisticsTotalVotesCast from "./components/TotalVotesCast";

interface ProposalStatisticsPanelVotingOpenOrClosedProps {
  submissionsCount: number;
}

const ProposalStatisticsPanelVotingOpenOrClosed: FC<ProposalStatisticsPanelVotingOpenOrClosedProps> = ({
  submissionsCount,
}) => {
  const asPath = usePathname();
  const { address, chainName } = extractPathSegments(asPath ?? "");
  const chainId = chains.filter(
    (chain: { name: string }) => chain.name.toLowerCase().replace(" ", "") === chainName,
  )?.[0]?.id;
  const { version, isLoading, isError } = useContractVersion(address, chainId);
  const isV3OrHigher = !isLoading && !isError && version && compareVersions(version, "3.0") >= 0;

  return (
    <div className="flex flex-col md:flex-row gap-1 md:items-center">
      <p className="text-[16px] text-neutral-11">
        {submissionsCount} submission{submissionsCount !== 1 ? "s" : ""}
      </p>
      {isV3OrHigher && (
        <>
          <span className="hidden md:block">&#8226;</span>
          <div className="flex gap-1 items-center text-[16px] text-neutral-11">
            <ProposalStatisticsTotalVotesCast address={address} chainId={chainId} />
            <ProposalStatisticsTotalVotes address={address} chainId={chainId} /> votes cast in contest
          </div>
        </>
      )}
    </div>
  );
};

export default ProposalStatisticsPanelVotingOpenOrClosed;
