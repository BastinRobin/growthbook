import { FC } from "react";
import { ImpactEstimateInterface } from "back-end/types/impact-estimate";

function formatNumber(num: number): string {
  if (num > 1000000) {
    return Math.floor(num / 1000000) + "m";
  } else if (num > 1000) {
    return Math.floor(num / 1000) + "k";
  } else if (num > 10) {
    return num.toFixed(0);
  }
  return num.toFixed(2);
}

function formatDays(num: number): string {
  if (num > 365) {
    return Math.floor(num / 365) + "+ years";
  } else if (num > 21) {
    return Math.floor(num / 7) + "+ weeks";
  }
  return Math.ceil(num) + " days";
}

const ImpactProjections: FC<{
  estimateParams?: {
    estimate: string;
    improvement: number;
    numVariations: number;
    userAdjustment: number;
  };
  estimate?: ImpactEstimateInterface;
  length: number;
}> = ({ estimate, estimateParams, length }) => {
  let experimentLength: string, traffic: string, conversions: string;

  if (estimateParams && estimate) {
    const cr = estimate.users ? estimate.value / estimate.users : 0;

    const trafficPerVariationPerDay =
      ((estimateParams.userAdjustment / 100) * estimate.users) /
      estimateParams.numVariations;

    const conversionsPerVariationPerDay = trafficPerVariationPerDay * cr;

    experimentLength = formatDays(length);
    traffic = formatNumber(trafficPerVariationPerDay);
    conversions = formatNumber(conversionsPerVariationPerDay);
  } else {
    experimentLength = "? days";
    traffic = conversions = "?";
  }

  return (
    <div>
      <strong>Projections</strong>
      <div className="mb-2">
        <small>
          <em>Experiment Length:</em>
        </small>
        <div className="pt-1">
          <strong className="border p-1 mr-1">{experimentLength}</strong>
          <small className="text-muted">minimum</small>
        </div>
      </div>
      <div className="mb-2">
        <small>
          <em>User Traffic:</em>
        </small>
        <div className="pt-1">
          <strong className="border p-1 mr-1">{traffic}</strong>
          <small className="text-muted">/variation/day</small>
        </div>
      </div>
      <div className="mb-2">
        <small>
          <em>Conversions:</em>
        </small>
        <div className="pt-1">
          <strong className="border p-1 mr-1">{conversions}</strong>
          <small className="text-muted">/variation/day</small>
        </div>
      </div>
    </div>
  );
};

export default ImpactProjections;
