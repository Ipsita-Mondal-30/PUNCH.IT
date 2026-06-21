#!/usr/bin/env bash
set -euo pipefail

REGION="${GCP_REGION:-us-central1}"
PROJECT_ID="${GCP_PROJECT_ID:?GCP_PROJECT_ID is required}"

SERVICES=("api" "worker" "web")

for SERVICE in "${SERVICES[@]}"; do
  echo "Deploying ${SERVICE} to Cloud Run..."
  gcloud run deploy "punch-it-${SERVICE}" \
    --project="${PROJECT_ID}" \
    --region="${REGION}" \
    --source="." \
    --dockerfile="apps/${SERVICE}/Dockerfile" \
    --allow-unauthenticated \
    --quiet
done

echo "All services deployed successfully."
