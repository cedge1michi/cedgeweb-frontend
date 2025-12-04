import type { Organization, WebSite, WithContext, SearchAction } from "schema-dts";
import { serviceSite } from "@/lib/definitions";

type SearchActionLoose = SearchAction & { ["query-input"]?: string };

const businessJsonLd: WithContext<Organization> = {
	"@context": "https://schema.org",
	"@type": "Organization",
	url: serviceSite.url,
	logo: serviceSite.logo,
	name: [serviceSite.name, serviceSite.nameInEnglish],
	description: serviceSite.description,
};

const websiteJsonLd: WithContext<WebSite> = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: serviceSite.name,
	alternateName: serviceSite.name,
	url: serviceSite.url,
	potentialAction: {
		"@type": "SearchAction",
		target: `${serviceSite.url}/search?q={search_term_string}`,
		"query-input": "required name=search_term_string",
	} as SearchActionLoose,
};

export default function Head() {
	return (
		<>
			<link rel="icon" href="/favicon.ico" sizes="any" />
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD needs to be injected as a string.
				dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
			/>
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD needs to be injected as a string.
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
			/>
		</>
	);
}
