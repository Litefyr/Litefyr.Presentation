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
     * Returns the font size class
     *
     * @param integer|null $size
     * @param integer|null $shift
     * @param integer|null $min
     * @param integer|null $max
     * @return string
     */
    public function fontSize(?int $size = null, ?int $shift = null, ?int $min = null, int $max = null): string
    {
        $min = $min ?? -2;
        $max = $max ?? 5;
        $shift = $shift ?? 0;

        if (!$size) {
            $size = 0;
        }
        $size = $size + $shift;

        if ($size < $min) {
            $size = $min;
        }

        if ($size > $max) {
            $size = $max;
        }

        if ($size <= -2) {
            return 'text-fl-xs';
        }
        if ($size == -1) {
            return 'text-fl-sm';
        }
        if ($size == 1) {
            return 'text-fl-lg';
        }
        if ($size == 2) {
            return 'text-fl-xl';
        }
        if ($size == 3) {
            return 'text-fl-2xl';
        }
        if ($size == 4) {
            return 'text-fl-3xl';
        }
        if ($size >= 5) {
            return 'text-fl-4xl';
        }
        return 'text-fl-base';
    }

    /**
     * Return the class and style for rounded images
     *
     * @param string|null $rounded
     * @return array
     */
    public function rounded(?string $rounded = null): array
    {
        if ($rounded == null || $rounded == '') {
            return [
                'class' => null,
                'style' => null,
            ];
        }

        return [
            'class' => $rounded == '9999px' || str_contains($rounded, ' / ') ? 'images-round' : 'images-default',
            'style' => sprintf('--rounded-image:%s;', $rounded),
        ];
    }

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
     * Returns the clipPath class
     *
     * @param string|null $name
     * @param array|string|null $modifier
     * @return string|null
     */
    public function clippathClass(?string $name = null, $modifier = null): ?string
    {
        if (!$name || !in_array($name, ['header', 'content', 'footer'])) {
            return null;
        }
        $name = sprintf('clippath-%s', $name);
        return BEMService::getClassNamesString($name, null, $modifier);
    }

    /**
     * Generates a BEM string and the clipPath class
     *
     * @param string|NodeInterface string or NodeInterface
     * @param string|null $clippath
     * @return string|null
     */
    public function cssClass($input, ?string $clippath = null): ?string
    {
        $clippathClass = $this->clippathClass($clippath);
        $additionalClass = $clippathClass ? ' ' . $clippathClass : '';
        if (is_string($input)) {
            return BEMService::getClassNamesString('litefyr', null, strtolower($input)) . $additionalClass;
        }
        if (!$input instanceof NodeInterface) {
            return $clippathClass;
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
            return BEMService::getClassNamesString($vendor, null, $element) . $additionalClass;
        }

        if ($element) {
            $modifier = sprintf('%s-%s', $package, $element);
        } else {
            $modifier = $package;
        }

        return BEMService::getClassNamesString($vendor, null, $modifier) . $additionalClass;
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
