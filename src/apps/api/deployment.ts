import * as k8s from "@pulumi/kubernetes";
import { CustomResource } from "@pulumi/pulumi";
import secrets from "./secrets";

export const deployApi = (
  kubernetesProvider,
  dependsOn: CustomResource[] = []
) => {
  const api = new k8s.yaml.ConfigGroup(
    "api",
    {
      skipAwait: true,
      files: [
        "https://raw.githubusercontent.com/EddieHubCommunity/api/main/kubernetes/service.yaml",
        "https://raw.githubusercontent.com/EddieHubCommunity/api/infrastructure/kubernetes/deployment.yaml", // TODO: back to main branch
        "https://raw.githubusercontent.com/EddieHubCommunity/api/main/kubernetes/ingress.yaml",
      ],
    },
    // mongo://mongo:27017/api
    // envFrom: {
    //   secret: {
    //}
    // - name: SECRET_USERNAME
    //     valueFrom:
    //       secretKeyRef:
    //         name: mysecret
    //         key: username
    //         optional: false # same as default; "mysecret" must exist
    //                         # and include a key named "username"
    // - name: MONGOD_USERNAME
    //     valueFrom:
    //       secretKeyRef:
    //         name: mongodb-credentials
    //         key: mongodb-username
    {
      provider: kubernetesProvider,
      dependsOn: [kubernetesProvider, ...dependsOn],
    }
  );
  return api;
};
