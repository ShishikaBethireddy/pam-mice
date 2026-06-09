# PAM-MICE

**Proposal Builder for Hotel Sales** — an automated RFP-to-proposal workflow for hotel sales managers. Pull from Cvent & Salesforce, check Opera PMS availability, and generate polished proposals.

## Stack

- **Frontend:** React + Vite + TypeScript + shadcn/ui + Tailwind CSS

## Deployment

This repository is deployed via the **Deployer K8s PaaS** platform. The deployable application lives under `deployer-apps/pam-mice/src/`, and deployment is automated through GitHub Actions (merging to `main` triggers an ArgoCD sync).

See [DEPLOYMENT.md](DEPLOYMENT.md) and [DEPLOYER-README.md](DEPLOYER-README.md) for details.

## Local development

```bash
npm install
npm run dev
```
