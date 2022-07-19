import * as kubernetes from "@pulumi/kubernetes";

export const deployIngressController = (provider: kubernetes.Provider) => {
  const emissaryNamespace = new kubernetes.core.v1.Namespace(
    "emissary",
    {},
    {
      provider,
    }
  );

  const emissaryCrds = new kubernetes.yaml.ConfigFile(
    "emissary-crds",
    {
      file: "https://app.getambassador.io/yaml/emissary/3.0.0/emissary-crds.yaml",
    },
    {
      provider,
      dependsOn: emissaryNamespace,
    }
  );

  // https://artifacthub.io/packages/helm/datawire/emissary-ingress/
  const emissaryDeploy = new kubernetes.helm.v3.Release(
    "emissary",
    {
      chart: "emissary-ingress",
      repositoryOpts: {
        repo: "https://app.getambassador.io",
      },
      values: {
        service: {
          type: "LoadBalancer",
        },
      },
    },
    {
      provider,
    }
  );
};
