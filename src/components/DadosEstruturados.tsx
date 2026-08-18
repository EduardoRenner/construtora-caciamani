import { empresa } from "@/content/empresa";
import { urlSite } from "@/lib/site";

/**
 * JSON-LD do negócio, para o Google entender que a Caciamani é uma
 * construtora que atende uma região específica.
 *
 * Só entra no JSON o que a empresa realmente forneceu. Campos pendentes
 * (endereço, CNPJ, coordenadas, horário) são OMITIDOS em vez de irem
 * vazios ou inventados — dado errado em `LocalBusiness` prejudica mais
 * do que dado ausente, porque o Google cruza com outras fontes.
 */
export function DadosEstruturados({ cidades }: { cidades: string[] }) {
  const { endereco, cadastro, telefones, redes } = empresa;

  const dados: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["GeneralContractor", "LocalBusiness"],
    "@id": `${urlSite}#negocio`,
    name: empresa.nome,
    description: `Construtora e incorporadora em ${empresa.cidadeSede}/${empresa.uf}. Projeto e construção de casas, casas geminadas e prédios.`,
    url: urlSite,
    telephone: `+${telefones.principal.internacional}`,
    areaServed: cidades.map((cidade) => ({
      "@type": "City",
      name: `${cidade}, ${empresa.uf}`,
    })),
    knowsLanguage: "pt-BR",
    sameAs: [redes.instagram.url, redes.facebook.url].filter(Boolean),
  };

  // Endereço: o Google aceita parcial, mas cidade e estado errados são
  // pior que ausentes. Só emite o que existe.
  const endereçoPostal: Record<string, string> = {
    "@type": "PostalAddress",
    addressLocality: endereco.cidade,
    addressRegion: endereco.uf,
    addressCountry: "BR",
  };
  if (endereco.logradouro) endereçoPostal.streetAddress = endereco.logradouro;
  if (endereco.cep) endereçoPostal.postalCode = endereco.cep;
  dados.address = endereçoPostal;

  if (endereco.latitude !== null && endereco.longitude !== null) {
    dados.geo = {
      "@type": "GeoCoordinates",
      latitude: endereco.latitude,
      longitude: endereco.longitude,
    };
  }

  if (empresa.horarioAtendimento) {
    dados.openingHours = empresa.horarioAtendimento;
  }

  if (cadastro.cnpj) dados.taxID = cadastro.cnpj;
  if (cadastro.razaoSocial) dados.legalName = cadastro.razaoSocial;
  if (empresa.email) dados.email = empresa.email;

  if (empresa.proprietario.nome) {
    dados.founder = { "@type": "Person", name: empresa.proprietario.nome };
  }

  return (
    <script
      type="application/ld+json"
      // O conteúdo é montado aqui, a partir de dados nossos — não há
      // entrada de usuário nesta string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados) }}
    />
  );
}
