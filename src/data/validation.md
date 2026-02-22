# URL Validation Report

## Validation Methodology

All image URLs and YouTube links were validated using the following methods:

### Image URL Validation
1. **HTTP Status Check**: Each URL was verified to return HTTP 200
2. **Content-Type Verification**: Confirmed `Content-Type: image/*` header
3. **Format Support**: All images are JPEG or PNG format supported by `next/image`

### YouTube URL Validation
1. **URL Accessibility**: Confirmed YouTube video pages are accessible
2. **Video Relevance**: Verified videos are cooking tutorials related to the recipe
3. **Privacy-Enhanced Embedding**: All videos use `youtube-nocookie.com` embed format

---

## Validation Results

### Images - 36 Total (3 per recipe × 12 recipes)

All 36 image URLs validated successfully:
- HTTP 200 responses confirmed
- Content-Type headers verified as `image/jpeg` or `image/png`
- URLs use Unsplash CDN (stable, reliable source)

### YouTube Videos - 12 Total

All 12 YouTube video URLs validated:
- Videos are accessible and public
- Content is relevant cooking tutorials
- Embed URLs formatted for privacy-enhanced mode

---

## Notes

- **Unsplash URLs**: All images sourced from Unsplash's direct photo URLs which are permanent and stable
- **Fallback Strategy**: If any image URL becomes unavailable, source page URLs are documented in `sources.md` for re-validation
- **Re-validation**: URLs should be re-validated annually or when images fail to load
