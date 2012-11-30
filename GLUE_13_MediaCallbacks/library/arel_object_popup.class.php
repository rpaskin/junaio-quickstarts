<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 **/

/**
 * 
 * Popup element for arel Objects
 * @author angermann
 *
 */
class arelObjectPopup
{
	private $buttons = array();
	private $description = NULL;
	
	/**
	 * Set available buttons for the popup
	 * @param Array ButtonArray Array with buttons (array with id, name and value) definition
	 * e.g. [["1", "url", "http://www.junaio.com"], ["2", "sound", "http://www.junaio.com/song.mp3]]
	 */
	public function setButtons($button){
		$this->buttons = $button;
	}
	
	/**
	 * Get available buttons for the popup
	 * @return Array array of buttons e.g. [["1", "url", "http://www.junaio.com"], ["2", "sound", "http://www.junaio.com/song.mp3]]
	 */ 
	public function getButtons(){
		return $this->buttons;
	}
	
	/** 
	 * Add a single button to the pop up
	 * @param Array $button A button to be displayed in the pop up (e.g. ["1", "url", "http://www.junaio.com"])
	 */
	
	public function addButton($button){
		$this->buttons[] = $button;
	}
	
	/**
	 * Set text to be displayed on the pop up
	 * @param String $description description text 
	 */
	public function setDescription($description){
		$this->description = $description;
	}
	
	/**
	 * Get text to be displayed on the pop up
	 * @return String description text 
	 */
	public function getDescription(){
		return $this->description;
	}
}
