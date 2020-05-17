<?php
/**
 *
 *
 * $Source: /cvsopen/waterman3/www_abon/library/Lab/View/Helper/Cachecreate.php,v $
 * $Id: Cachecreate.php,v 1.4 2019/07/02 08:22:47 rea Exp $
 */

class Lab_View_Helper_CacheRemove extends Zend_View_Helper_Abstract
{

    /** */
    public function cacheRemove()
    {   
        if (file_exists(__DIR__.'\CacheCommonMenu.php')) {
            unlink(__DIR__.'\CacheCommonMenu.php');
        }

    }

}