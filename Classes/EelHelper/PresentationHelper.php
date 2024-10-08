<?php

namespace Litefyr\Presentation\EelHelper;

use Carbon\Eel\Service\BEMService;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\Eel\ProtectedContextAwareInterface;
use Neos\Flow\Annotations as Flow;
use enshrined\svgSanitize\Sanitizer;

#[Flow\Proxy(false)]
class PresentationHelper implements ProtectedContextAwareInterface
{
    /**
     * Sanitize SVG content
     *
     * @param string $content
     * @param boolean $minify
     * @return string
     */
    public function sanitizeSVG(?string $content, bool $removeDoctype = true, bool $minify = true): string
    {
        if (!$content) {
            return '';
        }
        $sanitizer = new Sanitizer();
        $sanitizer->removeRemoteReferences(true);
        if ($minify) {
            $sanitizer->minify(true);
        }
        if ($removeDoctype) {
            $sanitizer->removeXMLTag(true);
        }

        return trim($sanitizer->sanitize($content));
    }

    /**
     * Insert typewriter syntax into string
     *
     * @param string|null $string
     * @param boolean $enable
     * @param string|null $cssClass
     * @return string|null
     */
    public function typewriter(?string $string = null, bool $enable = true, ?string $cssClass = null): ?string
    {
        if (!$enable || !$string) {
            return $string;
        }

        $cssClass = $cssClass ? sprintf(' class="%s"', $cssClass) : '';
        $string = preg_replace_callback(
            '/\[([^]]*)\]/',
            function ($matches) use ($cssClass) {
                $parts = explode('|', $matches[1]);
                $text = $parts[0];
                return sprintf(
                    '<span%s x-data="{text:[\'%s\']}" x-typewriter="text">%s</span>',
                    $cssClass,
                    implode("','", $parts),
                    $text
                );
            },
            $string
        );
        return $string;
    }

    /**
     * Removes typewriter syntax from string
     *
     * @param string $string
     * @param boolean $enable
     * @return string
     */
    public function removeTypewriter(string $string, bool $enable = true): string
    {
        if (!$enable) {
            return $string;
        }

        $string = preg_replace_callback(
            '/\[([^]]*)\]/',
            function ($matches) {
                $parts = explode('|', $matches[1]);
                return $parts[0];
            },
            $string
        );
        return (string) $string;
    }

    /**
     * Returns the smallest number from an array
     *
     * @param array<integer|float> $array
     * @return integer|float|string
     */
    public function smallestNumberFromArray(array $array): int|float|string
    {
        return min($this->filterNumberArray($array));
    }

    /**
     * Returns the biggest number from an array
     *
     * @param array<integer|float> $array
     * @return integer|float|string
     */
    public function biggestNumberFromArray(array $array): int|float|string
    {
        return max($this->filterNumberArray($array));
    }

    /**
     * Generates a BEM string
     *
     * @param string|NodeInterface string or NodeInterface
     * @return string|null
     */
    public function cssClass($input): ?string
    {
        if (is_string($input)) {
            return BEMService::getClassNamesString('litefyr', null, strtolower($input));
        }
        if (!$input instanceof NodeInterface) {
            return null;
        }
        $name = strtolower($input->getNodeType()->getName());
        $array = explode(':', $name);

        $vendorAndPackage = explode('.', $array[0]);
        $vendor = $vendorAndPackage[0];
        $package = end($vendorAndPackage);

        $element = explode('.', $array[1]);
        $element = array_filter($element, function ($value) {
            return !in_array($value, ['content', 'document']);
        });
        $element = implode('-', $element);

        // Site packages
        if (in_array($package, ['agora', 'alexandria'])) {
            return BEMService::getClassNamesString($vendor, null, $element);
        }

        return BEMService::getClassNamesString($vendor, null, sprintf('%s-%s', $package, $element));
    }

    /**
     * Filters an array for numeric values
     *
     * @param array<mixed> $array
     * @return array<float|int|string>
     */
    private function filterNumberArray(array $array): array
    {
        return array_filter($array, function ($number) {
            return is_numeric($number);
        });
    }

    /**
     * All methods are considered safe
     *
     * @param string $methodName The name of the method
     * @return bool
     */
    public function allowsCallOfMethod($methodName)
    {
        return true;
    }
}
