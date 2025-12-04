import type { Organization, SearchAction, WebSite, WithContext } from "schema-dts";
import { serviceSite } from "@/lib/definitions";

type SearchActionLoose = SearchAction & { ["query-input"]?: string };

const businessJsonLd: WithContext<Organization> = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: serviceSite.name,
	alternateName: serviceSite.name,
	description: serviceSite.description,
	url: serviceSite.url,
	logo: serviceSite.logo,
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

const jsonLdPayloads = [
	{ id: "business-json-ld", payload: businessJsonLd },
	{ id: "website-json-ld", payload: websiteJsonLd },
];

export function JsonLdScripts() {
	return jsonLdPayloads.map(({ id, payload }) => (
		<script
			key={id}
			id={id}
			type="application/ld+json"
			// JSON-LD は <script> の中に生の文字列として埋め込む必要がある。
			dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
		/>
	));
}
